import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Report3 = () => {
  const location = useLocation();
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState(3);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create form data to handle file uploads
      const formData = new FormData();
      
      // Add all the text data from previous steps
      const reportData = location.state?.formData || {};
      Object.keys(reportData).forEach(key => {
        // Handle date objects by converting to ISO string
        if (reportData[key] instanceof Date) {
          formData.append(key, reportData[key].toISOString());
        } else {
          formData.append(key, reportData[key]);
        }
      });
      
      // Add images
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      

      // Send to backend
      const response = await axios.post('http://report-std.scit.co:5007/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to success page with report data
      navigate('/reportcreated', { 
        state: { 
          formData: reportData,
          reportId: response.data.data._id,
          images: images.map(img => URL.createObjectURL(img))
        } 
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#F2FAFA', overflow: 'auto', position: 'relative' }}>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 120px)', marginTop: '50px' }}>
        <div style={containerStyle}>
          <div style={titleStyle}>Create Report</div>

          {/* Stepper Progress */}
          <div style={stepperStyle}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div style={{
                  ...stepStyle,
                  backgroundColor: step <= currentStep ? '#88D499' : '#E0E0E0',
                  color: step <= currentStep ? 'white' : '#9D9D9D',
                }}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '50px',
                    height: '4px',
                    backgroundColor: step < currentStep ? '#88D499' : '#E0E0E0'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Instructions */}
          <div style={instructionsStyle}>
            <p><strong>Instructions for the Uploaded Photo:</strong></p>
            <p style={bulletPointStyle}>1. Ensure the lighting is adequate to clearly display the damages.</p>
            <p style={bulletPointStyle}>2. Capture images of all areas showing visible damages.</p>
            <p style={bulletPointStyle}>3. Take close-up shots of the damages.</p>
            <p style={bulletPointStyle}>4. Make sure the camera is focused directly on the damages for sharp detail.</p>
            <p style={bulletPointStyle}>5. Avoid using flash, as it may distort the image.</p>
          </div>

          {/* Upload Image */}
          <div style={uploadTitleStyle}>Upload Image:</div>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            style={fileInputStyle} 
          />

          {/* Preview Images */}
          {images.length > 0 && (
            <div style={previewContainer}>
              <p>Selected images: {images.length}</p>
              <div style={previewImages}>
                {Array.from(images).map((image, index) => (
                  <div key={index} style={previewItem}>
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`preview-${index}`} 
                      style={previewImage} 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div style={errorStyle}>{error}</div>}

          {/* Submit Button */}
          <button 
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
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

const instructionsStyle = {
  color: '#5E6366',
  fontSize: '14px',
  fontFamily: 'Inter',
  fontWeight: '400',
  lineHeight: '1.6',
  letterSpacing: '0.5px',
  wordWrap: 'break-word',
  textAlign: 'left',
  backgroundColor: '#F2FAFA',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '20px',
  border: '1px solid #ccc',
};

const bulletPointStyle = {
  color: '#5E6366',
  marginLeft: '10px',
};

const uploadTitleStyle = {
  width: '100%',
  textAlign: 'left',
  fontSize: '18px',
  fontWeight: '400',
  color: '#252525',
  marginBottom: '10px',
};

const fileInputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  cursor: 'pointer',
  backgroundColor: '#fff',
};

const previewContainer = {
  marginTop: '15px',
  textAlign: 'center'
};

const previewImages = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  marginTop: '10px',
  justifyContent: 'center'
};

const previewItem = {
  width: '80px',
  height: '80px',
  overflow: 'hidden',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const previewImage = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
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

const errorStyle = {
  color: 'red',
  margin: '10px 0',
  fontSize: '14px'
};

export default Report3;