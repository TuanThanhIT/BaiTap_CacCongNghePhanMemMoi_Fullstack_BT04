const { model } = require("mongoose");

const delay = (req, res, next) => {
  if (req.header.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log(`check token: ${token}`);
  }
  next();
};
module.exports = delay;
