const fs = require("fs");
const jwt = require("jsonwebtoken");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `\n${Date.now}:${req.ip} ${req.method}:${req.path}\n`,
      (err, data) => {
        next();
      }
    );
  };
}

const isTokenValid = (req, res, next) => {
  var authToken = req.headers.authorization;

  jwt.verify(authToken, "sampel-secret", (err, user) => {
    if (err) {
      res.status(401).json({ success: false, data: "Token is not Valid!" });
    } else {
      next();
    }
  });
};



module.exports = { logReqRes, isTokenValid };
