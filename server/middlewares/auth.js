const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized' });
  }
};

// Role authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `User role ${req.user.role} is not authorized` 
      });
    }
    next();
  };
};

// Class-level authorization
exports.authorizeClassLevel = (className, level) => {
  return async (req, res, next) => {
    if (req.user.role === 'admin') return next();

    const hasAccess = req.user.classLevels.some(
      cl => cl.class.name === className && cl.level === level
    );

    if (!hasAccess) {
      return res.status(403).json({ 
        error: `Not authorized for ${className} at ${level} level` 
      });
    }
    
    next();
  };
};