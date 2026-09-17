export const validateLogin = (req, res, next) => {
    const { idNumber, password } = req.body;
    
    // Validate ID Number
    if (!idNumber || !/^\d{10}$/.test(idNumber)) {
      return res.status(400).json({
        success: false,
        message: 'ID must be exactly 10 digits'
      });
    }
    
    // Validate Password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    next();
  };
  
  export const validateRegistration = (req, res, next) => {
    const { name, idNumber, email, password } = req.body;
    
    // Validate Name
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    // Validate ID Number
    if (!idNumber || !/^\d{10}$/.test(idNumber)) {
      return res.status(400).json({
        success: false,
        message: 'ID must be exactly 10 digits'
      });
    }
    
    // Validate Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }
    
    // Validate Password
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }
    
    next();
  };