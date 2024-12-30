const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  let token = req.cookies.jwt;
  if (!token) {
    res.send("No token provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, decoded) => {
      if (error) return res.send("Token is not valid");
      // console.log("inside validate token, decoded is: ")
      // console.log(decoded);
      else req.userId = decoded?.userId;
      next();
    });
  }
};

module.exports = validateToken;
