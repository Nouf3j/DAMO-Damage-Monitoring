import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import Footer from './Footer';
import './Report2.css';

const Report2 = () => {
  const location = useLocation();
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState({
    ...location.state?.formData,
    plateNumber: '',
    vehicleName: '',
    date: null,
    time: null,
    description: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleNext = () => {
    if (!formData.plateNumber || !formData.vehicleName || !formData.date || !formData.time || !formData.description) {
      alert('Please fill all fields');
      return;
    }
    navigate('/report3', { state: { formData } });
  };

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
      className="report2-input"
      onClick={onClick}
      ref={ref}
      value={value}
      placeholder={placeholder}
      readOnly
    />
  ));

  return (
    <div className="report2-app-container">
      <div className="report2-wrapper">
        <div className="report2-form-container">
          <div className="report2-title">Create Report</div>

          {/* Stepper Progress */}
          <div className="report2-stepper">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`report2-step ${step <= currentStep ? 'report2-step-active' : 'report2-step-inactive'}`}>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`report2-step-connector ${step < currentStep ? 'report2-connector-active' : 'report2-connector-inactive'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="report2-section-title">Accident Information:</div>

          {/* Plate Number */}
          <div className="report2-input-container">
            <input
              type="text"
              name="plateNumber"
              placeholder="Plate Number"
              value={formData.plateNumber}
              onChange={handleChange}
              className="report2-input"
            />
          </div>

          {/* Vehicle Name */}
          <div className="report2-input-container">
            <input
              type="text"
              name="vehicleName"
              placeholder="Vehicle Name"
              value={formData.vehicleName}
              onChange={handleChange}
              className="report2-input"
            />
          </div>

          {/* Date Picker */}
          <div className="report2-input-container">
            <div className="report2-datetime-wrapper">
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                placeholderText="Select Date (MM/DD/YYYY)"
                dateFormat="MM/dd/yyyy"
                onChangeRaw={(e) => handleChange({ target: { name: 'date', value: e.target.value } })}
                isClearable
                customInput={<CustomInput />}
              />
              <FaCalendarAlt className="report2-calendar-icon" />
            </div>
          </div>

          {/* Time Picker */}
          <div className="report2-input-container">
            <div className="report2-datetime-wrapper">
              <DatePicker
                selected={formData.time}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                placeholderText="Select Time (HH:MM AM/PM)"
                onChangeRaw={(e) => handleChange({ target: { name: 'time', value: e.target.value } })}
                isClearable
                customInput={<CustomInput />}
              />
              <FaClock className="report2-clock-icon" />
            </div>
          </div>

          {/* Description */}
          <div className="report2-input-container">
            <textarea
              placeholder="Please provide a description of the incident, including: time, location, and an explanation of how it happened."
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="report2-textarea"
            ></textarea>
          </div>

          {/* Next Button */}
          <div className="report2-button-container">
            <button
              className="report2-button"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Report2;