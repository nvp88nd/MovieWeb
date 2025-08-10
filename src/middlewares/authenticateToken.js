const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return handleUnauthorized(req, res);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return handleUnauthorized(req, res);
        }
        req.user = user; // payload chứa thông tin user
        return next();
    });
}

function handleUnauthorized(req, res) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    return res.redirect('/login');
}

module.exports = authenticateToken;
