const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category");
const ApiError = require("../utils/apiError");

const createCateService = async (name, description) => {
  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Category đã tồn tại!");
    }
    const cate = new Category({
      name,
      description,
    });
    return cate.save();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lỗi! Tạo Category thất bại"
    );
    // throw new Error(error);
  }
};

const getAllCateService = async () => {
  try {
    const cates = await Category.find();
    return cates;
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lỗi! Không lấy được category"
    );
  }
};
module.exports = {
  createCateService,
  getAllCateService,
};
