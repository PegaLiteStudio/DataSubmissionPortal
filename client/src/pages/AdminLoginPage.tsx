import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';

// Hard-coded admin key
const ADMIN_KEY = 'ASDF2025';

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Check access key
    if (accessKey === ADMIN_KEY) {
      // Store auth in session storage
      sessionStorage.setItem('adminAuth', 'true');
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Invalid access key');
    }
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Admin Access</h1>
      </div>
      
      {error && (
        <div style={{ 
          background: '#ffecec', 
          padding: '10px', 
          border: '1px solid #f5aca6',
          marginBottom: '20px',
          borderRadius: '5px',
          color: '#cc0033'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ 
        padding: '20px', 
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Access Key
          </label>
          <input 
            type="password" 
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter your access key"
            required
          />
        </div>
        <div>
          <button 
            type="submit"
            style={{ 
              width: '100%',
              padding: '10px',
              backgroundColor: '#1a75ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Access Dashboard
          </button>
        </div>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: '#555', textDecoration: 'none' }}>
          Return to Main Site
        </a>
      </div>
    </div>
  );
}