
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.error(err.stack);
    
    // Determine status code, default to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
    
    // Send a structured error response
    res.status(statusCode).json({
        message: err.message || 'An unexpected error occurred on the server.',
        // Only include the stack trace in development environment for security
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
