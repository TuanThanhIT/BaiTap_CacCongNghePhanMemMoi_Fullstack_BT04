const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment");
const Product = require("../models/product");
const User = require("../models/user");
const ApiError = require("../utils/apiError");

const addCommentProductService = async (userId, productId, content, rating) => {
  try {
    const userExisting = await User.findById(userId);
    const productExisting = await Product.findById(productId);

    if (!userExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User không tồn tại");
    }

    if (!productExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    const comment = await Comment.create({
      user: userId,
      product: productId,
      content,
      rating,
    });

    return comment;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getCommentProductService = async (productId) => {
  try {
    const productExisting = await Product.findById(productId);

    if (!productExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    const productComments = await Comment.find({ product: productId })
      .populate("user", "name email")
      .select("user content rating");
    return productComments;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  addCommentProductService,
  getCommentProductService,
};
