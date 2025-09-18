require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product");

const createUserService = async (name, email, password) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      console.log(`Email đã tồn tại: ${email}`);
      return null;
    }

    // hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // save user password
    let result = await User.create({
      name,
      email,
      password: hashPassword,
      role: "ABC",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const handleLogin = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 1,
          EM: "Email hoặc password không hợp lệ",
        };
      } else {
        const payload = {
          id: user._id,
          email: user.email,
          name: user.name,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 2,
        EM: "User không tồn tại",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find().select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addFavoriteProductService = async (userId, productId) => {
  try {
    const userExisting = await User.findById(userId);
    const productExisting = await Product.findById(productId);

    if (!userExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    if (!productExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { favorites: productId },
      },
      { new: true }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getFavoriteProductService = async (userId) => {
  try {
    const userExisting = await User.findById(userId);
    if (!userExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }
    console.log("userId", userId);
    const userFavorite = await User.findById(userId)
      .populate("favorites")
      .select("favorites")
      .lean();
    return userFavorite;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const removeFavoriteProductService = async (userId, productId) => {
  try {
    const userExisting = await User.findById(userId);
    const productExisting = await Product.findById(productId);

    if (!userExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    if (!productExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { favorites: productId },
      },
      { new: true }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const addRecentlyViewedService = async (userId, productId) => {
  try {
    const userExisting = await User.findById(userId);
    if (!userExisting)
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");

    const productExisting = await Product.findById(productId);
    if (!productExisting)
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");

    // Xóa product đã tồn tại
    await User.updateOne(
      { _id: userId },
      { $pull: { recentlyViewed: { product: productId } } }
    );

    // Thêm product mới vào đầu mảng, giữ max 20 item
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          recentlyViewed: {
            $each: [{ product: productId, viewedAt: Date.now() }],
            $position: 0,
            $slice: 20,
          },
        },
      }
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getRecentlyViewedService = async (userId) => {
  try {
    const userExisting = await User.findById(userId);

    if (!userExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    const userRecentlyViewed = await User.findById(userId)
      .populate("recentlyViewed")
      .select("recentlyViewed");
    return userRecentlyViewed;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  createUserService,
  handleLogin,
  getUserService,
  addFavoriteProductService,
  removeFavoriteProductService,
  getFavoriteProductService,
  addRecentlyViewedService,
  getRecentlyViewedService,
};
