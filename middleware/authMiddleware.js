const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('X-Auth');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    jwt.verify(token, "117788", (err, user) => {
        if (err) {

            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        next();
    });
};


function generateAccessToken(username) {
    return jwt.sign(username, "117788");
}


module.exports = {
    authenticateToken,
    generateAccessToken
};