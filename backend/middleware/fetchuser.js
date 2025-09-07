const jwt = require("jsonwebtoken");

module.exports = function fetchuser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user; // make sure your JWT payload has { user: { id } }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


