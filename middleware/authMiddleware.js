require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('X-Auth');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    jwt.verify(token, ((process.env.JWTKEY).toString()), (err, user) => {
        if (err) {

            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        next();
    });
};


function generateAccessToken(username) {
    return jwt.sign(username, (process.env.JWTKEY).toString());
}


module.exports = {
    authenticateToken,
    generateAccessToken
};