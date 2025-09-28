const jwt = require("jsonwebtoken");

module.exports = function fetchuser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "IamMalayPandya");
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


