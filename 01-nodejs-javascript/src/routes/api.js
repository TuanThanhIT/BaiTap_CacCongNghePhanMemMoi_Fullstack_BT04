const express = require("express");
const {
  createUser,
  userLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const multer = require("multer");

const {
  createCategory,
  getAllCategory,
} = require("../controllers/categoryController");
const {
  createProduct,
  getAllProductByCate,
  getAllProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
  res.status(200).json("Hello world!");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", userLogin);
routerAPI.get("/users", getUser);
routerAPI.get("/account", getAccount);

var uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 },
});

routerAPI.post("/category", createCategory);
routerAPI.get("/category", getAllCategory);

routerAPI.post("/product", uploader.array("files", 5), createProduct);
routerAPI.get("/product", getAllProduct);
routerAPI.get("/product/:cateId", getAllProductByCate);

module.exports = routerAPI; //export default
