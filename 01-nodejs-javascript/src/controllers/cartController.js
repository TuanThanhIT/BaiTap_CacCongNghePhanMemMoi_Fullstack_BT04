const {
  addProductCartService,
  getProductCartService,
  updateQuantityService,
  deleteProductCartService,
  deleteAllProductCartService,
} = require("../services/cartService");

const addProductCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const cart = await addProductCartService(userId, productId);
    return res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

const getProductCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = await getProductCartService(userId);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;
    const cartProduct = await updateQuantityService(
      userId,
      productId,
      quantity
    );
    return res.status(200).json(cartProduct);
  } catch (err) {
    next(err);
  }
};

const deleteProductCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const cart = await deleteProductCartService(userId, productId);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

const deleteAllProductCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await deleteAllProductCartService(userId);
    return res
      .status(200)
      .json({ message: "Toàn bộ giỏ hàng của bạn đã bị xóa" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  addProductCart,
  getProductCart,
  updateQuantity,
  deleteProductCart,
  deleteAllProductCart,
};
