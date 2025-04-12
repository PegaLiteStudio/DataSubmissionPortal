import type {Express, Request, Response} from "express";
import {createServer, type Server} from "http";
import {storage} from "./storage";
import * as fs from 'fs';
import * as path from 'path';
import {log} from "./vite";
import {adminAuthMiddleware} from "./middleware/adminAuth";
import {WebSocketServer} from 'ws';
import {respondFailed, respondSuccess, respondSuccessWithData, RESPONSE_MESSAGES} from "./responseManager.ts";

// File path for storing submissions
const DATA_FILE_PATH = path.join(process.cwd(), 'user-submissions.json');
const LINK_DATA_FILE_PATH = path.join(process.cwd(), 'client/public/links-data.json');

// Initialize the submissions file if it doesn't exist
function initSubmissionsFile() {
    if (!fs.existsSync(DATA_FILE_PATH)) {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({submissions: []}, null, 2));
        log(`Created empty submissions file at ${DATA_FILE_PATH}`);
    }
}

// Get all submissions
function getSubmissions() {
    initSubmissionsFile();
    try {
        const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        return JSON.parse(fileData).submissions || [];
    } catch (error) {
        log(`Error reading submissions: ${error}`);
        return [];
    }
}

// Save or update a submission
function saveSubmission(userData: any, submissionId?: string) {
    const submissions = getSubmissions();
    let savedSubmission;

    if (submissionId) {
        // Find the existing submission by ID
        const existingIndex = submissions.findIndex((sub: any) => sub.id === submissionId);

        if (existingIndex !== -1) {
            // Update the existing submission with new data but keep the original ID
            savedSubmission = {
                ...submissions[existingIndex],
                ...userData,
                updatedAt: Date.now()
            };

            // Replace the old submission with the updated one
            submissions[existingIndex] = savedSubmission;
            log(`Updated existing submission with ID: ${submissionId}`);
        } else {
            // If submission ID not found, create a new one
            savedSubmission = createNewSubmission(userData);
            submissions.push(savedSubmission);
            log(`Created new submission as ID ${submissionId} not found`);
        }
    } else {
        // Create a new submission if no ID is provided
        savedSubmission = createNewSubmission(userData);
        submissions.push(savedSubmission);
        log(`Created new submission with ID: ${savedSubmission.id}`);
    }

    // Write back to the file
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({submissions}, null, 2));

    return savedSubmission;
}

// Helper function to create a new submission object
function createNewSubmission(userData: any) {
    return {
        ...userData,
        id: `sub_${Date.now()}${Math.floor(Math.random() * 1000)}`,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}

// Global WebSocketServer reference
let wss: WebSocketServer;
// Keep track of admin clients
const adminClients = new Set();

// Function to notify all admin clients of data updates
function notifyAdminClients() {
    const submissions = getSubmissions();
    if (adminClients.size > 0) {
        const message = JSON.stringify({
            type: 'submissions_update',
            data: {submissions}
        });

        // Send to all connected admin clients
        adminClients.forEach((client: any) => {
            if (client.readyState === 1) { // 1 = WebSocket.OPEN
                client.send(message);
            }
        });

        log(`Notified ${adminClients.size} admin clients of data update`);
    }
}

export async function registerRoutes(app: Express): Promise<Server> {
    // Initialize the submissions file
    initSubmissionsFile();

    app.post("/api/getLinks", (_req: Request, res: Response) => {
        try {
            const rawData = fs.readFileSync(LINK_DATA_FILE_PATH, 'utf-8');
            const data = JSON.parse(rawData);
            const transformedData = Object.entries(data).map(([linkId, linkData]) => ({
                linkId,
                ...linkData
            }));

            respondSuccessWithData(res, transformedData);
        } catch (error) {
            console.error(`Error fetching data:`, error);
            res.status(500).json({success: false, error: "Failed to get data"});
        }
    });

    app.post("/api/getLinksUnSorted", (_req: Request, res: Response) => {
        try {
            const rawData = fs.readFileSync(LINK_DATA_FILE_PATH, 'utf-8');
            const data = JSON.parse(rawData);

            respondSuccessWithData(res, data);
        } catch (error) {
            console.error(`Error fetching data:`, error);
            res.status(500).json({success: false, error: "Failed to get data"});
        }
    });

    app.post("/api/addLink", (req: Request, res: Response) => {
        const {linkId, expires, active = true} = req.body;
        if (!linkId || !expires) {
            return respondFailed(res, RESPONSE_MESSAGES.MISSING_PARAMETERS);
        }

        try {
            const rawData = fs.readFileSync(LINK_DATA_FILE_PATH, 'utf-8');
            const data = JSON.parse(rawData);

            data[linkId] = {
                active,
                expires
            };

            fs.writeFileSync(LINK_DATA_FILE_PATH, JSON.stringify(data, null, 2));

            respondSuccess(res);
        } catch (error) {
            console.error(`Error fetching data:`, error);
            res.status(500).json({success: false, error: "Failed to get data"});
        }
    });

    app.post("/api/deleteLink/:linkId", (req: Request, res: Response) => {
        const linkId = req.params.linkId;
        if (!linkId) {
            return respondFailed(res, RESPONSE_MESSAGES.MISSING_PARAMETERS);
        }

        try {
            const rawData = fs.readFileSync(LINK_DATA_FILE_PATH, 'utf-8');
            const data = JSON.parse(rawData);

            delete data.linkId;

            fs.writeFileSync(LINK_DATA_FILE_PATH, JSON.stringify(data, null, 2));

            respondSuccess(res);
        } catch (error) {
            console.error(`Error fetching data:`, error);
            res.status(500).json({success: false, error: "Failed to get data"});
        }
    });

    // Route to save user data
    app.post("/api/save-data", (req: Request, res: Response) => {
        try {
            const userData = req.body;
            const submissionId = req.body.submissionId || req.query.submissionId as string;

            // Save or update the submission
            const savedSubmission = saveSubmission(userData, submissionId);

            log(`User data saved to ${DATA_FILE_PATH}`);

            // Notify all connected admin clients about the data update
            notifyAdminClients();

            res.json({
                success: true,
                message: "Data saved successfully",
                submissionId: savedSubmission.id
            });
        } catch (error) {
            log(`Error saving data: ${error}`);
            res.status(500).json({success: false, error: "Failed to save data"});
        }
    });

    // Admin route to get all submissions
    app.get("/api/admin/submissions", adminAuthMiddleware, (req: Request, res: Response) => {
        try {
            const submissions = getSubmissions();
            res.json({success: true, submissions});
        } catch (error) {
            log(`Error retrieving submissions: ${error}`);
            res.status(500).json({success: false, error: "Failed to retrieve submissions"});
        }
    });

    const httpServer = createServer(app);

    // Set up WebSocket server with a specific path to avoid conflicts with Vite's WebSocket
    wss = new WebSocketServer({
        server: httpServer,
        path: '/api/ws'
    });

    wss.on('connection', (ws: any, req: any) => {
        try {
            // Add to admin clients set (for simplicity, all websocket connections are treated as admin)
            adminClients.add(ws);
            log('Admin client connected via WebSocket');

            // Send initial data
            const submissions = getSubmissions();
            ws.send(JSON.stringify({
                type: 'submissions_update',
                data: {submissions}
            }));

            // Remove from set on disconnect
            ws.on('close', () => {
                adminClients.delete(ws);
                log('Admin client disconnected');
            });
        } catch (error) {
            log(`WebSocket connection error: ${error}`);
        }
    });

    return httpServer;
}
