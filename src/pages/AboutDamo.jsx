import React, { useState } from 'react';
import Footer from "../pages/Footer";
import "../pages/AboutDamo.css";

const AboutDamo= () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-container">
      
      {/* Main Section */}
      <main className="main-content">
        <div className="content-wrapper">
          
          <div className="overview-title">
          Overview of the <br/> DAMO (Damage Monitoring)
          </div>
          <div className="overview-description">
          The DAMO project is an innovative system designed to<br/>
            utilize computer vision technology to analyze and 
            assess damage resulting from car accidents. <br/>
            The project focuses on improving accident <br/>
            management and reducing delays caused by the late
            creation of accident reports. <br/>
            It achieves this by classifying the type of damage, 
            estimating repair costs as predictions based on <br/>
            the severity of the damage, and generating 
            a comprehensive accident report that 
            includes driver details.
          
          </div>

          {/* Objectives */}
          <div className="objectives-title">
            Objectives:
          </div>
          <div style={{ width: '100%' }}>
            
            <span className="objective-item" >
              - Enhance the user experience when dealing with car accidents.<br />
            </span>
            <span style={{ color: '#252525', fontSize: 13, fontFamily: 'Poppins', fontWeight: '400', wordWrap: 'break-word' }}>
              - Provide accurate reports to facilitate claims and repair processes.<br />
            </span>
            <span style={{ color: '#252525', fontSize: 13, fontFamily: 'Poppins', fontWeight: '400', wordWrap: 'break-word' }}>
              - Leverage technology to reduce delays caused by the late issuance of accident reports.
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutDamo;