const express = require("express");
const {
  createUser,
  userLogin,
  getUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  res.status(200).json("Hello world!");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", userLogin);
routerAPI.get("/users", getUser);

module.exports = routerAPI; //export default
