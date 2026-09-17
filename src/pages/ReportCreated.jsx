import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Footer from './Footer';
import Header from './Header';

const ReportCreated = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [report, setReport] = useState(location.state?.formData || null);
  const [reportId, setReportId] = useState(location.state?.reportId || null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [imageUrls, setImageUrls] = useState(location.state?.images || []);

  // Fetch report if we have reportId but not full report data
  useEffect(() => {
    if (reportId && !report) {
      fetchReport(reportId);
    }
  }, [reportId, report]);

  const fetchReport = async (id) => {
    console.log(reportId);
    setLoadingReport(true);
    setError(null);
    try {
      const response = await axios.get(`/api/reports/${id}`);
      setReport(response.data.data);
      // If images are available in the response
      if (response.data.data.images && response.data.data.images.length > 0) {
        setImageUrls(response.data.data.images.map(img => img.url));
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setError('Failed to fetch report details');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDownload = async () => {
    if (!report) {
      setError('No report data available to download');
      return;
    }

    setDownloadingPdf(true);
    try {
      // Create PDF document
      const doc = new jsPDF();
      let yPosition = 20;
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(53, 78, 171); // #354EAB
      doc.text('Accident Report', 105, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Add report date
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Generated on: ${currentDate}`, 20, yPosition);
      yPosition += 15;
      
      // Section: Driver Information
      doc.setFontSize(16);
      doc.setTextColor(53, 78, 171);
      doc.text('Driver Information', 20, yPosition);
      yPosition += 10;
      
      // Driver details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${report.name || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`National ID: ${report.nationalId || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`Phone Number: ${report.phoneNumber || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`Email: ${report.email || 'N/A'}`, 20, yPosition); yPosition += 15;
      
      // Section: Accident Information
      doc.setFontSize(16);
      doc.setTextColor(53, 78, 171);
      doc.text('Accident Information', 20, yPosition);
      yPosition += 10;
      
      // Accident details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Plate Number: ${report.plateNumber || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`Vehicle Name: ${report.vehicleName || 'N/A'}`, 20, yPosition); yPosition += 7;
      
      // Format date and time
      let dateStr = 'N/A';
      let timeStr = 'N/A';
      
      if (report.date) {
        const date = new Date(report.date);
        dateStr = date.toLocaleDateString();
      }
      
      if (report.time) {
        const time = new Date(report.time);
        timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      doc.text(`Date: ${dateStr}`, 20, yPosition); yPosition += 7;
      doc.text(`Time: ${timeStr}`, 20, yPosition); yPosition += 15;
      
      // Description
      doc.setFontSize(16);
      doc.setTextColor(53, 78, 171);
      doc.text('Description', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      
      // Split description into lines to fit page width
      const description = report.description || 'No description provided';
      const splitDescription = doc.splitTextToSize(description, 170);
      doc.text(splitDescription, 20, yPosition);
      
      // Add note about images
      yPosition += splitDescription.length * 7 + 15;
      doc.text(`Number of uploaded images: ${imageUrls.length}`, 20, yPosition);
      
      // Save the PDF
      doc.save(`accident-report-${currentDate}.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleView = () => {

    // Navigate to a detailed view page with the report data
    if (reportId) {
      navigate(`/view-report/${reportId}`, { state: { report, images: imageUrls } });
    } else if (report) {
      // If we don't have a reportId but have report data (temporary state before saving to DB)
      navigate('/view-report/temp', { state: { report, images: imageUrls } });
    } else {
      setError('No report data available to view');
    }
  };

  if (loadingReport) {
    return (
      <div className="app-container" style={{ width: '100vw',  backgroundColor: '#F2FAFA', overflow: 'auto', position: 'relative' }}>
        <div style={{...messageContainer, height: '70vh'}}>
          <div style={loadingStyle}>Loading report data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container" style={{ width: '100vw',  backgroundColor: '#F2FAFA', overflow: 'auto', position: 'relative' }}>
      <main style={{ padding: '1rem', textAlign: 'center' }}>
        {/* Report Created Message */}
        <div style={messageContainer}>
          <div style={titleStyle}>
            The report has been created
          </div>

          <div style={subtitleStyle}>
            You can now download or view the report
          </div>

          {/* Error message if any */}
          {error && <div style={errorStyle}>{error}</div>}

          {/* Buttons */}
          <div style={buttonsContainer}>
            <button
              style={{
                ...actionButton,
                opacity: downloadingPdf ? 0.7 : 1,
                cursor: downloadingPdf ? 'not-allowed' : 'pointer'
              }}
              onClick={handleDownload}
              disabled={downloadingPdf}
            >
              {downloadingPdf ? 'Generating...' : 'Download'}
            </button>

            <button
              style={actionButton}
              onClick={handleView}
            >
              View
            </button>
          </div>

          {/* Reference number */}
          {reportId && (
            <div style={referenceStyle}>
              Report Reference: #{reportId.slice(-6).toUpperCase()}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Styles
const messageContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
  textAlign: 'center'
};

const titleStyle = {
  color: '#354EAB',
  fontSize: '38px',
  fontFamily: 'Poppins',
  fontWeight: '700',
  marginBottom: '20px'
};

const subtitleStyle = {
  width: '400px',
  opacity: 0.75,
  color: '#252525',
  fontSize: '20px',
  fontFamily: 'Poppins',
  fontWeight: '400',
  marginBottom: '30px'
};

const buttonsContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px'
};

const actionButton = {
  width: '160px',
  height: '50px',
  backgroundColor: '#88D499',
  borderRadius: '12px',
  border: 'none',
  color: 'white',
  fontSize: '16px',
  fontFamily: 'Inter',
  fontWeight: '600',
  textTransform: 'uppercase',
  cursor: 'pointer'
};

const referenceStyle = {
  marginTop: '30px',
  padding: '10px 20px',
  backgroundColor: '#F2FAFA',
  border: '1px solid #ccc',
  borderRadius: '8px',
  color: '#354EAB',
  fontWeight: '600'
};

const errorStyle = {
  color: 'red',
  margin: '0 0 20px 0',
  padding: '10px',
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
  borderRadius: '5px',
  maxWidth: '400px'
};

const loadingStyle = {
  fontSize: '18px',
  color: '#354EAB',
  fontWeight: '500'
};

export default ReportCreated;