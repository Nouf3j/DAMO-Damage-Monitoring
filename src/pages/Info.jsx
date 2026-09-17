import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../pages/Footer';
import { FaUser, FaPhone, FaEnvelope, FaIdCard } from 'react-icons/fa';
import '../pages/Info.css';

const Info = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user2 = JSON.parse(localStorage.getItem('user'));
    if (!user2) {
      navigate('/login');
    } else {
      setPhone(user2.phone);
      setEmail(user2.email);
      setUserData(user2);
    }
  }, [navigate]);

  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const user_id = JSON.parse(localStorage.getItem('user')).id;
      
      const response = await fetch('http://report-std.scit.co:5007/api/auth/update-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id, phone, email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Update failed');

      localStorage.setItem('user', JSON.stringify(data.user));
      setUserData(data.user);
      setError('');
      navigate('/Homepage');
    } catch (error) {
      setError(error.message || 'Failed to update information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="profile-container">
          <div className="profile-header">
            <FaUser size={50} className="profile-icon" />
            <h1>Your Information</h1>
            <div className="welcome-message">Welcome, {userData?.name}</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            {/* حقل ID Number */}
            <div className="input-group">
              <FaIdCard className="input-icon" />
              <div className="display-field">
                {userData?.idNumber}
              </div>
              <span className="field-label">ID Number</span>
            </div>

            {/* حقل Phone */}
            <div className="input-group">
              <FaPhone className="input-icon" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder=" "
                className="profile-input"
              />
              <span className="field-label">Phone Number</span>
            </div>

            {/* حقل Email */}
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="profile-input"
              />
              <span className="field-label">Email Address</span>
            </div>

            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Info;