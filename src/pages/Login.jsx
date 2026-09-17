import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Footer from "../pages/Footer";
import "../pages/Login.css";

const Login = () => {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // Check if user is already logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // User is already logged in, redirect to homepage
      navigate('/');
    }
  }, [navigate]);

  const handleIdChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setIdNumber(value);
      setError("");
    } else {
      setError("ID must be exactly 10 digits");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Form validation
    if (idNumber.length !== 10) {
      setError("ID must be exactly 10 digits");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://report-std.scit.co:5007/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Save a session flag to indicate the user is logged in
      localStorage.setItem('isLoggedIn', 'true');

      // Save login timestamp
      localStorage.setItem('loginTime', Date.now().toString());

      // Redirect to homepage instead of info page
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="login-content">
          <div className="form-container">
            <div style={titleStyle}>Log in</div>

            <form onSubmit={handleLogin}>
              {/* ID Number Input */}
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  value={idNumber}
                  onChange={handleIdChange}
                  placeholder="Enter your ID"
                  maxLength="10"
                  style={inputStyle}
                />
              </div>

              {/* Password Input */}
              <div style={{ marginBottom: "20px", position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={inputStyle}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeIconStyle}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              {/* Error Message */}
              {error && <div style={errorStyle}>{error}</div>}

              {/* Login Button */}
              <button
                type="submit"
                style={buttonStyle}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Additional Links */}
            <div style={linksContainerStyle}>
              <span>You do not have an account?</span>
              <a href="/signup" style={linkStyle}>Sign up</a>
              <br />
              <a href="/ForgetPass" style={forgotPasswordStyle}>Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// **Styles**
const containerStyle = {
  width: "400px",
  backgroundColor: "white",
  padding: "45px",
  borderRadius: "18px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.10)",
  textAlign: "center",
  background: "#F8FBFF",
};

const titleStyle = {
  color: "#354EAB",
  fontSize: "36px",
  fontWeight: "700",
  marginBottom: "35px",
};

const inputStyle = {
  width: "95%",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  color: "#9D9D9D",
};

const eyeIconStyle = {
  position: "absolute",
  right: "10px",
  cursor: "pointer",
  fontSize: "20px",
  color: "#354EAB",
};

const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginBottom: "10px",
};

const buttonStyle = {
  width: "65%",
  padding: "15px",
  backgroundColor: "#88D499",
  borderRadius: "10px",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
};

const linksContainerStyle = {
  marginTop: "20px",
  fontSize: "11px",
  color: "#252525",
};

const linkStyle = {
  color: "#354EAB",
  textDecoration: "none",
  marginLeft: "5px",
};

const forgotPasswordStyle = {
  color: "#354EAB",
  textDecoration: "none",
  fontSize: "11px",
  display: "block",
  marginTop: "8px",
};

export default Login;