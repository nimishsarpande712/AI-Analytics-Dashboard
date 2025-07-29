const express = require('express');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Mock registration - in production, hash password and save to database
    const user = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock login - in production, verify credentials against database
    const user = {
      id: 1,
      name: 'John Doe',
      email: email,
      role: 'admin'
    };

    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Mock current user - in production, extract from JWT token
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      preferences: {
        theme: 'light',
        notifications: {
          email: true,
          push: false,
          sms: true
        },
        timezone: 'UTC'
      }
    };

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // In production, invalidate JWT token or add to blacklist
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

module.exports = router;
