const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
}

// Middleware to authorize based on role
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user?.role !== role) {
            return res.status(403).json({ message: "Access denied: Insufficient permissions" });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
