import nodemailer from 'nodemailer';
import crypto from 'crypto';
import 'dotenv/config';
import User from '../models/User.js';

// إعداد الـ transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// دالة إرسال البريد الترحيبي


 export const sendWelcomeEmail = async (userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'projectdamo1@gmail.com',
        pass: 'vvwaldeaesitpnlo',  
      },
    });

    const mailOptions = {
      from: '"Support Team" <projectdamo1@gmail.com>',
      to: userEmail,
      subject: 'Welcome to DAMO',
      html: `
      <h1 style="font-size: 36px; color: green;">Thank you for registering at DAMO!</h1>
      <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none; border-radius: 5px; font-size: 18px;">
        Go to Login Page
      </a>
    `,
    
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('تم إرسال البريد الإلكتروني:', info.response);
  } catch (error) {
    console.error('حدث خطأ أثناء إرسال البريد الإلكتروني:', error);
    throw new Error('فشل إرسال رسالة الترحيب');
  }
};




// توليد رمز إعادة تعيين كلمة المرور وتخزينه في المستخدم
export const generatePasswordResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 ساعة

    await user.save();

    return resetToken;
  } catch (error) {
    console.error('Error generating reset token:', error);
    throw error;
  }
};

// إرسال بريد إعادة تعيين كلمة المرور
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested a password reset. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #88D499; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <p>This link is valid for 1 hour.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);

    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
