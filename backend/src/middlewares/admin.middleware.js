
const authorizeAdmin = (req, res, next) => {
    // This middleware should run AFTER the 'authenticate' middleware
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }
    next();
};

module.exports = { authorizeAdmin };
