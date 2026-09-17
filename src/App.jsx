import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar"; // ✅ استيراد السايدبار
import Header from "./pages/Header"; // ✅ استيراد الهيدر
import Homepage from "./pages/Homepage";
import AboutDamo from "./pages/AboutDamo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Report1 from "./pages/Report1";
import Report2 from "./pages/Report2";
import Report3 from "./pages/Report3";
import ViewReport from "./pages/ViewReport";
import ResetPassword from "./pages/ResetPassword";
import Info from "./pages/Info";
import Inquiry from "./pages/Inquiry";
import ForgetPass from "./pages/ForgetPass";
import ReportCreated from "./pages/ReportCreated";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* ✅ Sidebar - يظهر في جميع الصفحات */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* ✅ Main content */}
        <div
          style={{
            flex: 1,
            marginLeft: sidebarOpen ? "250px" : "0", // يضبط المسافة مع القائمة الجانبية
            transition: "margin-left 0.3s ease",
          }}
        >
          {/* ✅ إضافة الهيدر ليكون ثابتًا في الأعلى */}
          <Header toggleSidebar={toggleSidebar} />

          {/* ✅ Routes - جميع الصفحات */}
          <div style={{ marginTop: "70px", padding: "20px" }}>
            <Routes>
              {/* ✅ جعل Homepage الصفحة الافتراضية عند الدخول */}
              <Route path="/" element={<Navigate to="/Homepage" />} />
              <Route path="/Homepage" element={<Homepage />} />
              <Route path="/AboutDamo" element={<AboutDamo />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Report1" element={<Report1 />} />
              <Route path="/Report2" element={<Report2 />} />
              <Route path="/Report3" element={<Report3 />} />
              <Route path="/ForgetPass" element={<ForgetPass />} />
              <Route path="/Info" element={<Info />} />
              <Route path="/view-report/:id" element={<ViewReport />} />
              <Route path="/Inquiry" element={<Inquiry />} />
              <Route path="/ReportCreated" element={<ReportCreated />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

