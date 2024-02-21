const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, 117788, (err, user) => {
    if (err) {
      let t = 117788
      return res.status(403).json({ message: 'Forbidden: Invalid token',t:t});
    }

    // Attach the user information to the request for further use in the route handlers
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
