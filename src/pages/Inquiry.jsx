import React, { useState } from "react";
import Header from "../pages/Header";
import Sidebar from "../pages/Sidebar";
import Footer from "../pages/Footer";
import axios from "axios";
import jsPDF from 'jspdf';
import "../pages/Inquiry.css";

const Inquiry = () => {
  const [reportNumber, setReportNumber] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleInputChange = (e) => {
    setReportNumber(e.target.value);
    setError("");
  };

  const fetchReport = async () => {
    if (!reportNumber.trim()) {
      setError("Please enter a report number");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://report-std.scit.co:5007/api/reports/number/${reportNumber}`);
      setReport(response.data.data);
      
      if (response.data.data.images && response.data.data.images.length > 0) {
        setImageUrls(response.data.data.images.map(img => img.url));
      } else {
        setImageUrls([]);
      }
      
      setError("");
    } catch (err) {
      setReport(null);
      setImageUrls([]);
      setError(err.response?.data?.error || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!report) return;
    const doc = new jsPDF();
    let yPosition = 15;

    doc.setFontSize(22);
    doc.setTextColor(53, 78, 171);
    doc.text("Accident Report", 105, yPosition, { align: "center" });
    yPosition += 20;
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Number: ${report.reportNumber || "N/A"}`, 20, yPosition);
    doc.text(`Report code: ${report.rcode || "N/A"}`, 100, yPosition);

    function getSafeDate() {
      const d = new Date();
      return [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
      ].join('/');
    }
    doc.text(`Date: ${getSafeDate()}`, 190, yPosition, { align: "right" })
    yPosition += 6;
    
    doc.setDrawColor(53, 78, 171);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
  
    doc.setFontSize(16);
    doc.setTextColor(53, 78, 171);
    doc.text("Driver Information", 20, yPosition);
    yPosition += 10;
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const driverInfo = [
      `Name: ${report.name || "N/A"}`,
      `National ID: ${report.nationalId || "N/A"}`,
      `Phone: ${report.phoneNumber || "N/A"}`,
      `Email: ${report.email || "N/A"}`
    ];
    
    driverInfo.forEach(info => {
      doc.text(info, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  
    doc.setFontSize(16);
    doc.setTextColor(53, 78, 171);
    doc.text("Vehicle Information", 20, yPosition);
    yPosition += 10;
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const vehicleInfo = [
      `Plate Number: ${report.plateNumber || "N/A"}`,
      `Vehicle Name: ${report.vehicleName || "N/A"}`
    ];
    
    vehicleInfo.forEach(info => {
      doc.text(info, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 10;
  
    doc.setFontSize(16);
    doc.setTextColor(53, 78, 171);
    doc.text("Accident Information", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const formatCleanDate = (dateString) => {
      if (!dateString) return "N/A";
      
      try {
        const cleaned = dateString.toString().replace(/\s+/g, '').replace(/[^\d/]/g, '');
        
        if (cleaned.length > 8 && !cleaned.includes('/')) {
          const year = cleaned.substring(0, 4);
          const month = cleaned.substring(4, 6);
          const day = cleaned.substring(6, 8);
          return `${year}/${month}/${day}`;
        }
        
        const parts = cleaned.split('/').filter(p => p !== '');
        if (parts.length >= 3) {
          const year = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          return `${year}/${month}/${day}`;
        }
        
        return "Invalid Date";
      } catch (e) {
        return "Invalid Date";
      }
    };

    const formatCleanTime = (timeString) => {
      if (!timeString) return "N/A";
      
      try {
        let cleaned = timeString.toString()
          .replace(/\s+/g, '')
          .replace(/[^\d:APM]/gi, '');
        
        const periodMatch = cleaned.match(/([AP]M)/i);
        const period = periodMatch ? periodMatch[0].toUpperCase() : '';
        cleaned = cleaned.replace(/([AP]M)/i, '');
        
        const parts = cleaned.split(':').map(part => part.replace(/\D/g, ''));
        let hours = parseInt(parts[0] || '0');
        const minutes = (parts[1] || '00').substring(0, 2).padStart(2, '0');
        const seconds = (parts[2] || '00').substring(0, 2).padStart(2, '0');
        
        let finalPeriod = period;
        if (!period) {
          finalPeriod = hours < 12 ? 'AM' : 'PM';
          hours = hours % 12 || 12;
        }
        
        return `${hours}:${minutes}:${seconds} ${finalPeriod}`.trim();
      } catch (e) {
        return "Invalid Time";
      }
    };

    const accidentDetails = [
      `Date: ${formatCleanDate(report.date)}`,
      `Time: ${formatCleanTime(report.time)}`
    ];

    accidentDetails.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 7;
    });
  
    yPosition += 10;
    doc.setFontSize(16);
    doc.setTextColor(53, 78, 171);
    doc.text("Description :", 20, yPosition);
    yPosition += 10;
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const description = report.description || "No description provided";
    const splitText = doc.splitTextToSize(description, 170);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 7 + 10;

    doc.setFontSize(16);
    doc.setTextColor(53, 78, 171);
    doc.text("Status", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report status and cost: ${report.status || "N/A"}`, 20, yPosition);
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
    
    doc.save(`accident-report-${report.reportNumber || new Date().getTime()}.pdf`);
  };

  const formatCleanDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const cleaned = dateString.toString().replace(/\s+/g, '').replace(/[^\d/]/g, '');
      
      if (cleaned.length > 8 && !cleaned.includes('/')) {
        const year = cleaned.substring(0, 4);
        const month = cleaned.substring(4, 6);
        const day = cleaned.substring(6, 8);
        return `${year}/${month}/${day}`;
      }
      
      const parts = cleaned.split('/').filter(p => p !== '');
      if (parts.length >= 3) {
        const year = parts[0].length === 2 ? `20${parts[0]}` : parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${year}/${month}/${day}`;
      }
      
      return "Invalid Date";
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    try {
      if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
        const [hours, minutes] = timeString.split(':');
        const h = parseInt(hours, 10);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${minutes.padStart(2, '0')} ${period}`;
      }

      let time = timeString.toString().trim();
      const arabicToEnglish = (str) => str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      time = arabicToEnglish(time);

      time = time.replace(/ص|صباحاً?/g, 'AM')
                .replace(/م|مساءً?/g, 'PM')
                .replace(/٫/g, ':');

      const parts = time.split(/[\s:]+/);
      let hours = parseInt(parts[0], 10) || 0;
      const minutes = parts[1] ? parseInt(parts[1], 10) || 0 : 0;
      let period = (parts[2] || '').toUpperCase();

      if (time.includes('PM') && hours < 12) hours += 12;
      if (time.includes('AM') && hours === 12) hours = 0;

      const displayHours = hours % 12 || 12;
      const displayMinutes = String(minutes).padStart(2, '0');
      const displayPeriod = hours >= 12 ? 'PM' : 'AM';

      return `${displayHours}:${displayMinutes} ${displayPeriod}`;
    } catch (e) {
      console.error('Error formatting time:', e);
      return 'Invalid Time';
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
  
  return (
    <div
      className="app-container"
      style={{
        width: "100vw",
        backgroundColor: "#F2FAFA",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: "50px",
      }}
    >
      {/* Inquiry Form */}
      <div
        style={{
          width: "500px",
          minHeight: '500px',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "400px",
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.10)",
            textAlign: "center",
            background: "#F8FBFF",
          }}
        >
          <div
            style={{
              color: "#354EAB",
              fontSize: 40,
              fontFamily: "Poppins",
              fontWeight: "700",
              wordWrap: "break-word",
            }}
          >
            Inquiry
          </div>
          <div
            style={{
              opacity: 0.6,
              color: "#252525",
              fontSize: 24,
              fontFamily: "Poppins",
              fontWeight: "400",
              wordWrap: "break-word",
              marginBottom: "35px",
            }}
          >
            about a report
          </div>

          {/* Report Number Input */}
          <div style={{ marginBottom: "35px" }}>
            <input
              type="text"
              placeholder="Enter the report number"
              value={reportNumber}
              onChange={handleInputChange}
              style={{
                width: "95%",
                padding: "15px",
                borderRadius: "10px",
                border: error ? "1px solid red" : "1px solid #ccc",
                fontSize: "15px",
                color: "#9D9D9D",
                textAlign: "center",
              }}
            />
            {error && (
              <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {error}
              </p>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={fetchReport}
            disabled={loading}
            style={{
              width: "45%",
              padding: "15px",
              backgroundColor: "#354EAB",
              borderRadius: "10px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              transition: "0.3s",
              marginBottom: "20px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>

          {/* Report Details */}
          {report && (
            <div
              style={{
                marginTop: "20px",
                padding: "25px",
                backgroundColor: "#f5f5f5",
                borderRadius: "10px",
                textAlign: "left",
              }}
            >
              <h3 style={{ 
                color: "#354EAB", 
                marginBottom: "15px",
                fontSize: "20px",
                textAlign: "center"
              }}>
                Report Details
              </h3>
              
              {/* خط فاصل تحت العنوان الرئيسي */}
              <div style={{
                height: "1px",
                backgroundColor: "#354EAB",
                margin: "0 0 20px 0",
                opacity: 0.3
              }} />
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={sectionTitleStyle}>Driver Information</h4>
                <p><strong>Name:</strong> {report.name || 'N/A'}</p>
                <p><strong>National ID:</strong> {report.nationalId || 'N/A'}</p>
                <p><strong>Phone:</strong> {report.phoneNumber || 'N/A'}</p>
                <p><strong>Email:</strong> {report.email || 'N/A'}</p>
              </div>
              
              {/* خط فاصل بين الأقسام */}
              <div style={{
                height: "1px",
                backgroundColor: "#354EAB",
                margin: "0 0 20px 0",
                opacity: 0.2
              }} />
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={sectionTitleStyle}>Accident Information</h4>
                <p><strong>Plate Number:</strong> {report.plateNumber || 'N/A'}</p>
                <p><strong>Vehicle Name:</strong> {report.vehicleName || 'N/A'}</p>
                <p><strong>Date:</strong> {formatCleanDate(report.date)}</p>
                <p><strong>Time:</strong> {formatTime(report.time)}</p>
              </div>
              
              {/* خط فاصل بين الأقسام */}
              <div style={{
                height: "1px",
                backgroundColor: "#354EAB",
                margin: "0 0 20px 0",
                opacity: 0.2
              }} />
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={sectionTitleStyle}>Description</h4>
                <p>{report.description || 'No description provided'}</p>
              </div>
              
              {/* خط فاصل بين الأقسام */}
              <div style={{
                height: "1px",
                backgroundColor: "#354EAB",
                margin: "0 0 20px 0",
                opacity: 0.2
              }} />
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={sectionTitleStyle}>Status</h4>
                <p><strong>Status:</strong> {report.status || 'N/A'}</p>
              </div>
              
              {/* خط فاصل بين الأقسام */}
              <div style={{
                height: "1px",
                backgroundColor: "#354EAB",
                margin: "0 0 20px 0",
                opacity: 0.2
              }} />
              
              <div>
                <h4 style={sectionTitleStyle}>Images</h4>
                
                {/* Original Images */}
                {imageUrls.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <p><strong>Original Images ({imageUrls.length}):</strong></p>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '15px',
                      marginTop: '15px'
                    }}>
                      {imageUrls.map((url, index) => (
                        <div key={`original-${index}`} style={{
                          width: '100%',
                          height: '200px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={url}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain'
                            }}
                            alt={`Original accident scene ${index + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* خط فاصل بين الصور الأصلية والمعالجة */}
                {imageUrls.length > 0 && report.image_after_update && report.image_after_update.url && (
                  <div style={{
                    height: "1px",
                    backgroundColor: "#354EAB",
                    margin: "0 0 20px 0",
                    opacity: 0.2
                  }} />
                )}

                {/* Processed Image */}
                {report.image_after_update && report.image_after_update.url && (
                  <div style={{ marginBottom: '20px' }}>
                    <p><strong>Processed Image:</strong></p>
                    <div style={{
                      width: '100%',
                      height: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginTop: '10px'
                    }}>
                      <img 
                        src={`http://report-std.scit.co/server${report.image_after_update.url}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        alt="Processed accident"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Button */}
          {report && (
            <button
              onClick={downloadReport}
              style={{
                width: "45%",
                padding: "15px",
                backgroundColor: "#88D499",
                borderRadius: "10px",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                transition: "0.3s",
                marginTop: "20px",
              }}
            >
              Download
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Styles
const sectionTitleStyle = {
  color: "#354EAB",
  margin: "15px 0 10px 0",
  fontSize: "16px",
  fontWeight: "600"
};

export default Inquiry;