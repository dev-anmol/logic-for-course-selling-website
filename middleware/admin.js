// Middleware for handling auth
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const token = req.headers.authorization;
  const words = token.split(" ");
  const jwtToken = words[1];
  try {
    const result = jwt.verify(jwtToken, JWT_SECRET);
    if (result.username) {
      next();
    }
  } catch (e) {
    res.status(403).json({
      msg: "Admin doesn't exists",
    });
  }
}

module.exports = adminMiddleware;
