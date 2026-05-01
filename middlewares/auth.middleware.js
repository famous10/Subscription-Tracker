var jwt = require('jsonwebtoken');

var User = require('../models/user.model');
var { JWT_SECRET } = require('../config/env');

// ─── Authorize ────────────────────────────────────────────────────────────────
var authorize = async (req, res, next) => {
  try {
    var token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // Verify token
    var decoded = jwt.verify(token, JWT_SECRET);

    // Find user from token payload
    var user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    // Handle expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token has expired' });
    }

    // Handle invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    next(error);
  }
};

module.exports = { authorize };
