const express = require("express");
const {
  createUser,
  userLogin,
  getUser,
  getAccount,
  addFavoriteProduct,
  removeFavoriteProduct,
  getFavoriteProduct,
  addRecentlyViewed,
  getRecentlyViewed,
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
  getSimilarProduct,
  getProductDetail,
} = require("../controllers/productController");

const auth = require("../middleware/auth");

const {
  addCommentProduct,
  getProductComments,
  countComments,
} = require("../controllers/commentController");

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
routerAPI.get("/productDetail/:productId", getProductDetail);

// Favorite
routerAPI.post("/addFavorite/:productId", addFavoriteProduct);
routerAPI.delete("/deleteFavorite/:productId", removeFavoriteProduct);
routerAPI.get("/favorites", getFavoriteProduct);

//Related Product
routerAPI.get("/relatedProduct/:productId", getSimilarProduct);

// Recently Viewed
routerAPI.post("/addViewed/:productId", addRecentlyViewed);
routerAPI.get("/viewed", getRecentlyViewed);

// Comments
routerAPI.post("/addComment/:productId", addCommentProduct);
routerAPI.get("/comments/:productId", getProductComments);
module.exports = routerAPI;
