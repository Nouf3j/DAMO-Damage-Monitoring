import React, { useState } from 'react';
import Footer from '../pages/Footer';
import axios from 'axios'; // Make sure you have axios installed
import '../pages/ForgetPass.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
 const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // Function to handle the Send button click
  const handleSendClick = async () => {
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Make API call to request password reset
      const response = await axios.post('http://report-std.scit.co:5007/api/password/forgot-password', { email });

      if (response.data.success) {
        setMessage('Password reset link has been sent to your email');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{
      width: '100vw',
      
      backgroundColor: '#F2FAFA',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      overflow: 'auto',
      position: 'relative'
    }}>

      {/* Form Container */}
      <div style={{
        width: '500px',
        backgroundColor: 'white',
        padding: '60px',
        borderRadius: '20px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        background: '#F8FBFF',
        marginTop: '150px'
      }}>
        <div style={{
          color: '#252525',
          fontSize: '24px',
          fontFamily: 'Poppins',
          fontWeight: '500',
          marginBottom: '20px'
        }}>
          Did you forget your password?
        </div>

        <div style={{
          color: '#252525',
          fontSize: '16px',
          fontFamily: 'Poppins',
          fontWeight: '400',
          opacity: 0.8,
          marginBottom: '30px'
        }}>
          You can change your password using your email
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: '#e6f7e6',
            color: '#28a745',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#dc3545',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Email Input */}
        <div style={{ marginBottom: '40px' }}>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '12px',
              border: '1px solid #ccc',
              fontSize: '16px',
              color: '#555'
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendClick}
          disabled={isLoading}
          style={{
            width: '50%',
            padding: '16px',
            backgroundColor: '#88D499',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            border: 'none',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ForgetPassword;


