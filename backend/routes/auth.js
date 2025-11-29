const express = require('express');
const passport = require('../config/passport');
const { authenticateToken, authenticateAdmin } = require('../utils/middleware');
const { authLimiter } = require('../utils/limiter');
const { getRedirectPath } = require('../utils/redirectLogic');
const {
  login,
  verifyEmail,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
  sendOtp,
  verifyOtp,
} = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/userController');
const { registerLawyer, loginLawyer } = require('../controllers/lawyerController');

const router = express.Router();

// Registration
router.post('/register-user', authLimiter, registerUser);
router.post('/register-lawyer', authLimiter, registerLawyer);

// Unified register endpoint - intelligently routes to user or lawyer registration
router.post('/register', authLimiter, async (req, res) => {
  // Detect if this is a lawyer registration by checking for lawyer-specific fields
  const isLawyer = req.body.registration_id || req.body.law_firm || req.body.speciality;
  
  if (isLawyer) {
    console.log('🔵 Routing to lawyer registration');
    return registerLawyer(req, res);
  } else {
    console.log('🔵 Routing to user registration');
    return registerUser(req, res);
  }
});

// Login
router.post('/login', authLimiter, login);

// Email verification
router.post('/verify-email', verifyEmail);

// OTP endpoints
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

// Password reset with OTP
router.post('/forgot-password-otp', authLimiter, forgotPasswordOtp);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
router.post('/forgot-password', authLimiter, forgotPasswordOtp);
router.post('/reset-password', resetPassword);

// Profile management
router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, updateProfile);
router.post('/submit-later', authenticateToken, (req, res) => require('../controllers/authController').submitLater(req, res));
router.delete('/me', authenticateToken, deleteAccount);

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Debug endpoint
router.get('/debug-oauth', (req, res) => {
  res.json({
    session: req.session,
    query: req.query,
    env: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      FRONTEND_URL: process.env.FRONTEND_URL
    }
  });
});

// OAuth routes
router.get('/google', (req, res, next) => {
  console.log('🔵 Google OAuth initiated with role:', req.query.role);
  // Store role in session for callback
  if (req.query.role) {
    req.session.oauthRole = req.query.role;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Lawyer-specific Google OAuth
router.get('/google/lawyer', (req, res, next) => {
  req.session.oauthRole = 'lawyer';
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔵 Google callback received:', req.query);
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
      session: false,
      failureFlash: false
    })(req, res, (err) => {
      if (err) {
        console.log('❌ OAuth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message || 'oauth_failed')}`);
      }
      next();
    });
  },
  (req, res) => {
    console.log('✅ Google OAuth success:', req.user ? 'User found' : 'No user');
    
    if (!req.user) {
      console.log('❌ No user data from OAuth');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    
    const { token, role, user: oauthUser } = req.user;

    // Check if profile is completed - more robust checking
    const completed = oauthUser && (oauthUser.profile_completed === 1 || oauthUser.profile_completed === true);
    const isVerified = oauthUser && (oauthUser.is_verified === 1 || oauthUser.is_verified === true);
    const lawyerVerified = oauthUser && (oauthUser.lawyer_verified === 1 || oauthUser.lawyer_verified === true);
    
    let redirectUrl;
    
    console.log('🔍 OAuth Callback - Role:', role, 'Completed:', completed, 'Verified:', isVerified, 'LawyerVerified:', lawyerVerified);
    console.log('🔍 OAuth User Data:', { 
      id: oauthUser.id, 
      email: oauthUser.email, 
      profile_completed: oauthUser.profile_completed,
      is_verified: oauthUser.is_verified,
      lawyer_verified: oauthUser.lawyer_verified,
      registration_id: oauthUser.registration_id
    });
    
    // Determine if user needs profile setup
    const needsSetup = role === 'lawyer' ? !completed : (!completed && !isVerified);
    
    if (needsSetup) {
      // Redirect to appropriate setup page
      if (role === 'lawyer') {
        redirectUrl = `${process.env.FRONTEND_URL}/google-lawyer-setup?token=${token}`;
      } else {
        redirectUrl = `${process.env.FRONTEND_URL}/google-user-setup?token=${token}`;
      }
    } else {
      // Profile is complete, redirect to dashboard
      const userData = {
        role: role || 'user',
        is_admin: oauthUser.is_admin === 1 || oauthUser.is_admin === true || oauthUser.role === 'admin',
        registration_id: oauthUser.registration_id || null,
        redirect: oauthUser.redirect || null
      };
      
      const redirectPath = getRedirectPath(userData);
      redirectUrl = `${process.env.FRONTEND_URL}${redirectPath}?token=${token}`;
    }

    // Clear the stored role from session
    delete req.session.oauthRole;

    console.log(`🚀 Google OAuth redirect - Role: ${role}, NeedsSetup: ${needsSetup}, URL: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.token}`);
  }
);

module.exports = router;