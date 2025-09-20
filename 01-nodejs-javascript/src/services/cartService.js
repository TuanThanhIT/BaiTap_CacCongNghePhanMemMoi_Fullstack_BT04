const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

const addProductCartService = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    // Kiểm tra xem user đã có cart chưa
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Nếu chưa có thì tạo mới
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity: 1 }],
      });
    } else {
      // Nếu đã có cart, kiểm tra sản phẩm đã tồn tại chưa
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex > -1) {
        // Nếu đã tồn tại, tăng số lượng
        cart.products[productIndex].quantity += 1;
      } else {
        // Nếu chưa có, thêm mới
        cart.products.push({ product: productId, quantity: 1 });
      }
    }
    await cart.save();

    return cart;
  } catch (err) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
};

const getProductCartService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    const products = await Cart.findOne({ user: userId })
      .populate("products.product") // populate field product trong mảng products
      .select("products");
    return products;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
};

const updateQuantityService = async (userId, productId, quantity) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    const cartProduct = await Cart.findOne({ user: userId });
    for (let p of cartProduct.products) {
      if (p.product.toString() === productId) {
        p.quantity = quantity;
        break; // dừng vòng lặp
      }
    }
    await cartProduct.save();
    // populate sản phẩm
    await cartProduct.populate("products.product"); // trả về Promise

    return cartProduct;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
};

const deleteProductCartService = async (userId, productId) => {
  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: { products: { product: productId } },
      },
      { new: true }
    );
    await cart.populate("products.product");

    return cart;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
};

const deleteAllProductCartService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    await Cart.deleteOne({ user: userId });
  } catch (error) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err);
  }
};
module.exports = {
  addProductCartService,
  getProductCartService,
  updateQuantityService,
  deleteProductCartService,
  deleteAllProductCartService,
};
