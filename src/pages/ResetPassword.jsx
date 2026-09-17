import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../pages/Footer';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Make API call to reset password
      const response = await axios.post(`http://report-std.scit.co:5007/api/password/reset-password/${token}`, { 
        password 
      });
      
      if (response.data.success) {
        setMessage('Your password has been updated successfully');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
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
        marginTop:'150px'
      }}>
        <div style={{
          color: '#252525',
          fontSize: '24px',
          fontFamily: 'Poppins',
          fontWeight: '500',
          marginBottom: '20px'
        }}>
          Reset Your Password
        </div>

        <div style={{
          color: '#252525',
          fontSize: '16px',
          fontFamily: 'Poppins',
          fontWeight: '400',
          opacity: 0.8,
          marginBottom: '30px'
        }}>
          Enter your new password below
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

        <form onSubmit={handleResetPassword}>
          {/* Password Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          
          {/* Confirm Password Input */}
          <div style={{ marginBottom: '40px' }}>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Reset Button */}
          <button 
            type="submit"
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
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResetPassword;