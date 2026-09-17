import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Report1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    nationalId: '',
    phoneNumber: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Basic validation
    if (!formData.name || !formData.nationalId || !formData.phoneNumber || !formData.email) {
      alert('Please fill all fields');
      return;
    }
    navigate('/report2', { state: { formData } });
  };

  return (
    <div className="app-container" style={{   backgroundColor: '#F2FAFA', position: 'relative' }}>
     
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)'}}>
        <div style={containerStyle}>
          <div style={titleStyle}>Create Report</div>

          {/* Stepper Progress */}
          <div style={stepperStyle}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div style={{
                  ...stepStyle,
                  backgroundColor: currentStep === step ? '#88D499' : '#E0E0E0',
                  color: currentStep === step ? 'white' : '#9D9D9D',
                }}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '50px',
                    height: '4px',
                    backgroundColor: currentStep > step ? '#88D499' : '#E0E0E0'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={sectionTitleStyle}>Driver information:</div>

          {/* Form Inputs */}
          <div style={inputContainer}>
            <input 
              type="text" 
              name="name"
              placeholder="Enter your Name" 
              value={formData.name}
              onChange={handleChange}
              style={inputStyle} 
            />
          </div>

          <div style={inputContainer}>
            <input 
              type="text" 
              name="nationalId"
              placeholder="Enter your national ID" 
              value={formData.nationalId}
              onChange={handleChange}
              style={inputStyle} 
            />
          </div>

          <div style={inputContainer}>
            <input 
              type="text" 
              name="phoneNumber"
              placeholder="Enter your phone Number" 
              value={formData.phoneNumber}
              onChange={handleChange}
              style={inputStyle} 
            />
          </div>

          <div style={inputContainer}>
            <input 
              type="email" 
              name="email"
              placeholder="Enter your Email" 
              value={formData.email}
              onChange={handleChange}
              style={inputStyle} 
            />
          </div>

          {/* Next Button */}
          <button 
            style={buttonStyle} 
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Styles
const containerStyle = {
  width: '500px',
  backgroundColor: 'white',
  padding: '50px',
  borderRadius: '45px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  background: '#F8FBFF',
};

const titleStyle = {
  color: '#354EAB',
  fontSize: '36px',
  fontWeight: '700',
  marginBottom: '35px',
};

const stepperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px'
};

const stepStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold'
};

const sectionTitleStyle = {
  width: '185px',
  opacity: 0.60,
  color: '#252525',
  fontSize: '15px',
  fontWeight: '400',
  marginBottom: '25px'
};

const inputContainer = {
  marginBottom: '20px'
};

const inputStyle = {
  width: '95%',
  padding: '15px',
  borderRadius: '10px',
  border: '1px solid #ccc',
  fontSize: '15px',
  color: '#9D9D9D',
  textAlign: 'center',
};

const buttonStyle = {
  width: '50%',
  padding: '15px',
  backgroundColor: '#354EAB',
  borderRadius: '10px',
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  border: 'none'
};

export default Report1;