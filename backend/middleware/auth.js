const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "IamMalayPandya");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { authMiddleware };
