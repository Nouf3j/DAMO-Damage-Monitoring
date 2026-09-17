import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateLogin, validateRegistration } from '../midddlewares/validators.js';
import { v4 as uuidv4 } from 'uuid';
import { sendWelcomeEmail, generatePasswordResetToken, sendPasswordResetEmail } from '../midddlewares/emailService.js';



const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { idNumber, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ idNumber });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        idNumber: user.idNumber,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            idNumber: user.idNumber,
            phone: user.phone,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

const generateUniqueId = () => {
  // Using UUID v4 for unique ID generation
  return uuidv4();

  // Alternative if you don't want to use UUID:
  // return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const { name, idNumber, email, password, phone, role = 'user' } = req.body;
    const id = generateUniqueId();

    let userWithId = await User.findOne({ idNumber });
    if (userWithId) {
      return res.status(400).json({
        success: false,
        message: 'User with this ID already exists'
      });
    }

    let userWithEmail = await User.findOne({ email });
    if (userWithEmail) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = new User({
      id,
      name,
      phone,
      idNumber,
      email,
      password,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // إرسال البريد الترحيبي
    await sendWelcomeEmail(email);

    const payload = {
      user: {
        id: user._id,
        idNumber: user.idNumber,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        success: true,
        message: 'تم إنشاء الحساب بنجاح وتم إرسال رسالة ترحيبية إلى بريدك الإلكتروني.',
        token,
        user: {
          id: user._id,
          idNumber: user.idNumber,
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (err) {
    next(err);
  }
});

export default router;