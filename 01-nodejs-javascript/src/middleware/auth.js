const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const white_list = ["/login", "/register", "/"];
  if (white_list.find((item) => "/v1/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];

        const decoder = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoder.id,
          email: decoder.email,
          name: decoder.name,
          createdBy: "ntt",
        };
        console.log(`check token: ${decoder}`);
        next();
      } catch (err) {
        return res.status(401).json({
          message: "Token hết hạn/ hoặc không hợp lệ ",
        });
      }
    } else {
      return res.status(401).json({
        message:
          "Bạn chưa truyền Access Token ở headers/ hoặc Access Token hết hạn ",
      });
    }
  }
};
module.exports = auth;
