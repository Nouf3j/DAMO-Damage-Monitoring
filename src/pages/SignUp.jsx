import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Footer from "../pages/Footer";
import "../pages/SignUp.css";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();

  const handleIdChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setIdNumber(value);
      setError("");
    } else {
      setError("ID must be exactly 10 digits");
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name) {
      setError("Name is required");
      return;
    }

    if (idNumber.length !== 10) {
      setError("ID must be exactly 10 digits");
      return;
    }

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://report-std.scit.co:5007/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          idNumber,
          phone,
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Redirect to dashboard/info page
      navigate('/info');

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">

      <div className="signup-content ">
        <div className="form-container">
          <div style={titleStyle}>Sign up</div>

          <form onSubmit={handleSignup}>
            <div style={inputContainerStyle}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <input
                type="text"
                value={idNumber}
                onChange={handleIdChange}
                placeholder="Enter your ID (10 digits)"
                maxLength="10"
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone"
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            <div style={inputContainerStyle}>
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

            <div style={inputContainerStyle}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={inputStyle}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeIconStyle}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {error && <div style={errorStyle}>{error}</div>}

            <button
              type="submit"
              style={buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </button>
          </form>

          <div style={linksContainerStyle}>
            <span>Do you have an account?</span>
            <a href="/login" style={linkStyle}>Login</a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Styles
const appContainerStyle = {
  width: "100vw",
  backgroundColor: "#F2FAFA",
  overflow: "auto",
  position: "relative",
};

const formWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 80px)",
  marginTop: "50px",
};

const formContainerStyle = {
  maxWidth: "500px",
  width: "100%",
  backgroundColor: "white",
  padding: "50px",
  borderRadius: "20px",
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.12)",
  textAlign: "center",
  background: "#F8FBFF",
};

const titleStyle = {
  color: "#354EAB",
  fontSize: "36px",
  fontWeight: "700",
  marginBottom: "30px",
};

const inputContainerStyle = {
  marginBottom: "25px",
  position: "relative",
};

const inputStyle = {
  width: "100%",
  padding: "16px 5px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
  color: "#9D9D9D",
};

const eyeIconStyle = {
  position: "absolute",
  right: "15px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "22px",
  color: "#354EAB",
};

const errorStyle = {
  color: "red",
  fontSize: "14px",
  marginBottom: "12px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#88D499",
  borderRadius: "12px",
  color: "white",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  border: "none",
};

const linksContainerStyle = {
  marginTop: "20px",
  fontSize: "14px",
  color: "#252525",
};

const linkStyle = {
  color: "#354EAB",
  textDecoration: "none",
  marginLeft: "5px",
  fontWeight: "bold",
};

export default SignUp;