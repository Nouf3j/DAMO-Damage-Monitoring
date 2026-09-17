import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import Footer from './Footer';
import Header from './Header';
import { useParams } from 'react-router-dom';

const ReportCreated = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [report, setReport] = useState(location.state?.formData || null);
  const [reportId, setReportId] = useState(location.state?.reportId || id);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [imageUrls, setImageUrls] = useState(location.state?.images || []);
  const [showReportDetails, setShowReportDetails] = useState(false); // New state for showing details

  // Fetch report if we have reportId but not full report data
  useEffect(() => {
    if (reportId && !report) {
      fetchReport(reportId);
      return;
    }
    if (id && !id) {
      fetchReport(id);
    }
  }, [reportId, report]);

  const fetchReport = async (id) => {
    console.log(id);
    setLoadingReport(true);
    setError(null);
    try {
      const response = await axios.get(`http://report-std.scit.co:5007/api/reports/${id}`);
      setReport(response.data.data);
      console.log(response.data.data);
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
      doc.text(`Phone : ${report.phoneNumber || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`Email: ${report.email || 'N/A'}`, 20, yPosition); yPosition += 7;
      doc.text(`Status: ${report.status || 'N/A'}`, 20, yPosition); yPosition += 15;

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

      // Update yPosition based on description length
      yPosition += splitDescription.length * 7 + 15;

      // Add note about images
      doc.text(`Number of uploaded images: ${imageUrls.length}`, 20, yPosition);
      yPosition += 10;

      // Add images to PDF if they exist
      if (imageUrls.length > 0) {
        doc.setFontSize(16);
        doc.setTextColor(53, 78, 171);
        doc.text('Accident Images', 20, yPosition);
        yPosition += 10;

        // Add each image to the PDF with proper sizing
        for (let i = 0; i < imageUrls.length; i++) {
          // Add a new page if we're running out of space
          if (yPosition > 220) {
            doc.addPage();
            yPosition = 20;
          }

          try {
            // Convert image URL to base64
            console.log(imageUrls[i]);
            const imgData = await fetchImageAsBase64(imageUrls[i]);

            // Calculate dimensions to fit page width while maintaining aspect ratio
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40; // 20px margin on each side
            const maxWidth = pageWidth - margin;

            // Get image dimensions from the loaded image
            const img = new Image();
            await new Promise((resolve) => {
              img.onload = resolve;
              img.src = imgData;
            });

            // Calculate proportional height to maintain aspect ratio
            const aspectRatio = img.height / img.width;
            const imgWidth = maxWidth;
            const imgHeight = imgWidth * aspectRatio;

            // Position the image centered horizontally
            const xPosition = (pageWidth - imgWidth) / 2;

            // Check if image will fit on current page
            if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - 20) {
              doc.addPage();
              yPosition = 20;
            }

            // Add the image to the PDF
            doc.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);

            // Update yPosition for next content
            yPosition += imgHeight + 15;
          } catch (err) {
            console.error('Error adding image to PDF:', err);
            doc.text(`Failed to load image ${i + 1}`, 20, yPosition);
            yPosition += 10;
          }
        }
      }

      // Add the updated image if it exists
      if (report.image_after_update?.url) {
        // Check if we need a new page
        if (yPosition > 220) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(16);
        doc.setTextColor(53, 78, 171);
        doc.text('Updated Vehicle Image', 20, yPosition);
        yPosition += 10;

        try {
          const updatedImageUrl = `http://report-std.scit.co:5007${report.image_after_update.url}`;
          console.log(updatedImageUrl);
          const imgData = await fetchImageAsBase64(updatedImageUrl);

          // Calculate dimensions to fit page width while maintaining aspect ratio
          const pageWidth = doc.internal.pageSize.getWidth();
          const margin = 40; // 20px margin on each side
          const maxWidth = pageWidth - margin;

          // Get image dimensions
          const img = new Image();
          await new Promise((resolve) => {
            img.onload = resolve;
            img.src = imgData;
          });

          // Calculate proportional height to maintain aspect ratio
          const aspectRatio = img.height / img.width;
          const imgWidth = maxWidth;
          const imgHeight = imgWidth * aspectRatio;

          // Position the image centered horizontally
          const xPosition = (pageWidth - imgWidth) / 2;

          // Check if image will fit on current page
          if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            yPosition = 20;
          }

          // Add the image to the PDF
          doc.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
        } catch (err) {
          console.error('Error adding updated image to PDF:', err);
          doc.text('Failed to load updated vehicle image', 20, yPosition);
        }
      }

      // Save the PDF
      doc.save(`accident-report-${currentDate}.pdf`);

    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Helper function to fetch image and convert to base64
  const fetchImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Important for CORS

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        try {
          // Get base64 data URL
          const dataUrl = canvas.toDataURL('image/jpeg');
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };

      img.src = url;
    });
  };

  const handleView = () => {
    // Toggle the report details visibility
    setShowReportDetails(!showReportDetails);
  };

  if (loadingReport) {
    return (
      <div className="app-container" style={{ width: '100vw', backgroundColor: '#F2FAFA', overflow: 'auto', position: 'relative' }}>
        <div style={{ ...messageContainer, height: '70vh' }}>
          <div style={loadingStyle}>Loading report data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  };


  return (
    <div className="app-container" style={{ width: '100vw', backgroundColor: '#F2FAFA', overflow: 'auto', position: 'relative' }}>
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
              {showReportDetails ? 'Hide Report' : 'View Report'}
            </button>
          </div>

          {/* Reference number */}
          {reportId && (
            <div style={referenceStyle}>
              Report Reference: #{reportId.slice(-6).toUpperCase()}
            </div>
          )}
        </div>

        {/* Report Details Section */}
        {showReportDetails && report && (
          <div style={reportDetailsStyle}>
            <h2 style={{ color: '#354EAB', marginBottom: '20px' }}>Report Details</h2>

            <div style={detailsSectionStyle}>
              <h3 style={sectionTitleStyle}>Driver Information</h3>
              <p><strong>Name:</strong> {report.name || 'N/A'}</p>
              <p><strong>National ID:</strong> {report.nationalId || 'N/A'}</p>
              <p><strong>Phone Number:</strong> {report.phoneNumber || 'N/A'}</p>
              <p><strong>Email:</strong> {report.email || 'N/A'}</p>
            </div>

            <div style={detailsSectionStyle}>
              <h3 style={sectionTitleStyle}>Accident Information</h3>
              <p><strong>Plate Number:</strong> {report.plateNumber || 'N/A'}</p>
              <p><strong>Vehicle Name:</strong> {report.vehicleName || 'N/A'}</p>
              <p><strong>Date:</strong> {formatDate(report.date)}</p>
              <p><strong>Time:</strong> {report.time ? new Date(report.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
            </div>

            <div style={detailsSectionStyle}>
              <h3 style={sectionTitleStyle}>Description</h3>
              <p>{report.description || 'No description provided'}</p>
            </div>

            {imageUrls.length > 0 && (
              <div style={detailsSectionStyle}>
                <h3 style={sectionTitleStyle}>Uploaded Images ({imageUrls.length})</h3>
                <div style={imagesContainerStyle}>
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Accident scene ${index + 1}`}
                      style={imageStyle}
                    />
                  ))}
                </div>
              </div>
            )}

            <p>
              <strong>Status:</strong> {report.status}
            </p>

            {report.image_after_update?.url && (
              <div style={detailsSectionStyle}>
                <h3 style={sectionTitleStyle}>Updated Vehicle Image</h3>
                <div style={imagesContainerStyle}>
                  <img
                    src={"http://report-std.scit.co:5007" + report.image_after_update.url}
                    alt="Updated vehicle"
                    style={imageStyle}
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
  height: 'auto',
  textAlign: 'center',
  marginBottom: '40px'
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
  gap: '20px',
  marginBottom: '20px'
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

// New styles for report details
const reportDetailsStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '30px',
  margin: '20px auto',
  maxWidth: '800px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'left'
};

const detailsSectionStyle = {
  marginBottom: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid #eee'
};

const sectionTitleStyle = {
  color: '#354EAB',
  marginBottom: '15px'
};

const imagesContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  marginTop: '15px'
};

const imageStyle = {
  width: '150px',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

export default ReportCreated;