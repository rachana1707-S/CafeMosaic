// ===== FILE: middleware/errorHandler.js =====

// Custom error class for application errors
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Prisma errors
const handlePrismaError = (error) => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint failed
      const field = error.meta?.target?.[0] || 'field';
      return new AppError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        409,
        'DUPLICATE_ENTRY'
      );
      
    case 'P2025':
      // Record not found
      return new AppError(
        'Record not found',
        404,
        'RECORD_NOT_FOUND'
      );
      
    case 'P2014':
      // Required relation violation
      return new AppError(
        'Invalid relation. Referenced record does not exist',
        400,
        'INVALID_RELATION'
      );
      
    case 'P2003':
      // Foreign key constraint failed
      return new AppError(
        'Cannot delete record due to existing references',
        400,
        'FOREIGN_KEY_CONSTRAINT'
      );
      
    case 'P2021':
      // Table does not exist
      return new AppError(
        'Database table not found',
        500,
        'DATABASE_ERROR'
      );
      
    default:
      return new AppError(
        'Database operation failed',
        500,
        'DATABASE_ERROR'
      );
  }
};

// Handle JWT errors
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError(
      'Invalid authentication token',
      401,
      'INVALID_TOKEN'
    );
  } else if (error.name === 'TokenExpiredError') {
    return new AppError(
      'Authentication token expired',
      401,
      'TOKEN_EXPIRED'
    );
  }
  
  return new AppError(
    'Authentication failed',
    401,
    'AUTH_ERROR'
  );
};

// Handle validation errors
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(val => val.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

// Handle axios/API errors
const handleAxiosError = (error) => {
  if (error.response) {
    // API responded with error status
    return new AppError(
      `External API error: ${error.response.data?.message || error.message}`,
      error.response.status === 404 ? 404 : 503,
      'EXTERNAL_API_ERROR'
    );
  } else if (error.request) {
    // Network error
    return new AppError(
      'External service unavailable',
      503,
      'SERVICE_UNAVAILABLE'
    );
  }
  
  return new AppError(
    'External service error',
    500,
    'EXTERNAL_ERROR'
  );
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: {
      status: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      stack: err.stack,
      details: err
    }
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
      status: err.statusCode
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR:', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong!',
      errorCode: 'INTERNAL_SERVER_ERROR',
      status: 500
    });
  }
};

// Main error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.code && err.code.startsWith('P2')) {
    // Prisma error
    error = handlePrismaError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    // JWT error
    error = handleJWTError(err);
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error (if using)
    error = handleValidationError(err);
  } else if (err.isAxiosError) {
    // Axios/API error
    error = handleAxiosError(err);
  } else if (err.name === 'CastError') {
    // Invalid ID format
    error = new AppError('Invalid ID format', 400, 'INVALID_ID');
  }

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper to catch async errors
export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err, promise) => {
    console.log('UNHANDLED PROMISE REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'ROUTE_NOT_FOUND');
  next(err);
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('user-agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  next();
};

// Response time middleware
export const responseTimeLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    console.log(`Request completed in ${duration.toFixed(2)}ms - ${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });
  
  next();
};

// CORS error handler
export const corsErrorHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Export all functions and classes
export { 
  AppError,
  globalErrorHandler as default
};