const User = require("../models/user");
const {
  createUserService,
  handleLogin,
  getUserService,
  addFavoriteProductService,
  getFavoriteProductService,
  removeFavoriteProductService,
  addRecentlyViewedService,
  getRecentlyViewedService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await handleLogin(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const addFavoriteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await addFavoriteProductService(userId, productId);
    return res
      .status(201)
      .json({ message: "Thêm sản phẩm vào danh sách yêu thích thành công" });
  } catch (error) {
    next(error);
  }
};

const getFavoriteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userFavorites = await getFavoriteProductService(userId);
    return res.status(200).json(userFavorites);
  } catch (error) {
    next(error);
  }
};

const removeFavoriteProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    await removeFavoriteProductService(userId, productId);
    return res
      .status(200)
      .json({ message: "Đã xóa sản phẩm khỏi danh  sách yêu thích" });
  } catch (error) {
    next(error);
  }
};

const addRecentlyViewed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    await addRecentlyViewedService(userId, productId);
    return res.status(201).json({ message: "Sản phẩm đã xem" });
  } catch (error) {
    next(error);
  }
};

const getRecentlyViewed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recentlyViewed = await getRecentlyViewedService(userId);
    return res.status(200).json(recentlyViewed);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createUser,
  userLogin,
  getUser,
  getAccount,
  addFavoriteProduct,
  removeFavoriteProduct,
  getFavoriteProduct,
  addRecentlyViewed,
  getRecentlyViewed,
};
