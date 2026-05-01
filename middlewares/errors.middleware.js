var errorMiddleware = (err, req, res, next) => {
  try {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
      statusCode = 404;
      message = 'Resource not found';
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate field value entered';
    }

    // Handle Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map((val) => val.message).join(', ');
    }

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = errorMiddleware;
