import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js'; // Adjust path as needed
import { generatePasswordResetToken, sendPasswordResetEmail } from '../midddlewares/emailService.js';
import bcrypt from 'bcrypt'; // For hashing the new password

const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email address'
            });
        }

        // Generate token
        const resetToken = await generatePasswordResetToken(email);

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        await sendPasswordResetEmail(email, resetUrl);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Could not send reset email. Please try again later.'
        });
    }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;


        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        // Hash the token from URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // Save user
        await user.save();

        // Generate fresh JWT token for immediate login
        const payload = {
            user: {
                id: user._id,
                idNumber: user.idNumber,
                email: user.email,
                role: user.role
            }
        };

        // Create token with expiration
        const tokenExpiresIn = '24h';
        const authToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: tokenExpiresIn }
        );

        // Return success response with user data and token
        const userData = {
            id: user._id,
            idNumber: user.idNumber,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        };

        res.status(200).json({
            success: true,
            message: 'Password updated successfully. You are now logged in.',
            token: authToken,
            expiresIn: tokenExpiresIn,
            user: userData
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Could not reset password. Please try again.'
        });
    }
});

export default router;