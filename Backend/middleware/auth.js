const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Mock user - in production, fetch from database
      req.user = {
        id: decoded.id,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'admin'
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
