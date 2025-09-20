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
} = require("../controllers/commentController");
const {
  addProductCart,
  getProductCart,
  updateQuantity,
  deleteProductCart,
  deleteAllProductCart,
} = require("../controllers/cartController");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

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

// Cart
routerAPI.post("/cart/add/:productId", addProductCart);
routerAPI.get("/carts", getProductCart);
routerAPI.patch("/cart/update/:productId", updateQuantity);
routerAPI.delete("/cart/delete/:productId", deleteProductCart);
routerAPI.delete("/cart/deleteAll", deleteAllProductCart);

// Order
routerAPI.post("/order/add", createOrder); // tạo đơn hàng
routerAPI.get("/user/order", getUserOrders);
routerAPI.get("/order/:orderId", getOrderById); // xem chi tiết đơn hàng
routerAPI.put("/order/:orderId/status", updateOrderStatus); // admin cập nhật trạng thái
routerAPI.put("/order/cancel/:orderId", cancelOrder); // user hủy đơn hàng
