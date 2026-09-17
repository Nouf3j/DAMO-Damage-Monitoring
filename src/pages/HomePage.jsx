import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import accountIcon from "../assets/account.svg";
import reportIcon from "../assets/report.svg";
import backIcon from "../assets/back.svg";
import Footer from "../pages/Footer";
import Sidebar from "../pages/Sidebar";
import "../pages/Homepage.css";


const Homepage = () => {
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState("#F2FAFA");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    const updateBackground = () => {
      setBgColor(window.innerWidth < 768 ? "#EAF6F6" : "#F2FAFA");
    };

    window.addEventListener("resize", updateBackground);
    updateBackground();

    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  const handleCreateReportClick = () => {
    if (user) {
      navigate("/report1");
    } else {
      alert("Please login to create a report.");
      navigate("/login", { state: { from: "/report1" } });
    }
  };

  return (
    <div className="homepage-container">

      <div className="homepage-content">
        {sidebarOpen && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}

        <main className="homepage-main">
          <div className="main-content">
            <h1 className="homepage-title">
              Create a traffic <br /> accident report
            </h1>

            <p className="homepage-description">
              Creating a traffic accident report <br /> quickly allows you to speed up the repair process.
            </p>

            <button
              onClick={handleCreateReportClick}
              className="homepage-button"
              style={{
                backgroundColor: user ? "#88D499" : "#354EAB",
                color: user ? "white" : "#FFFFFF",
                cursor: "pointer"
              }}
              title={user ? "Create report" : "Login to create reports"}
            >
              {user ? "Create Report" : "Create Report"}
            </button>
          </div>

          <section className="steps-section">
            {[
              { text: "Create Account", description: "First you have to create an account here", icon: accountIcon },
              { text: "Create Report", description: "Create a traffic accident report", icon: reportIcon },
              { text: "Go back to the reports", description: "You can refer to the previous reports", icon: backIcon },
            ].map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-icon-container">
                  <img src={step.icon} alt={step.text} className="step-icon" />
                </div>
                <h2 className="step-title">{step.text}</h2>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;