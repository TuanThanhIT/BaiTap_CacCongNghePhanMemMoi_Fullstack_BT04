const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const Category = require("../models/category");
const Product = require("../models/product");

const createProductService = async (
  name,
  price,
  description,
  cateId,
  stock,
  images
) => {
  try {
    const existing = await Category.findById(cateId);
    if (!existing) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Category không tồn tại");
    }
    const product = new Product({
      name,
      price,
      description,
      category: cateId,
      stock,
      images,
    });
    return product.save();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Lỗi! Tạo sản phẩm thất bại"
    );
  }
};

const getAllProductByCateService = async (cateId, page, limit) => {
  const skip = (page - 1) * limit;

  const [products, totalItems] = await Promise.all([
    Product.find({ category: cateId }).skip(skip).limit(limit),
    Product.countDocuments({ category: cateId }),
  ]);

  return { products, totalItems };
};

const getAllProductService = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [products, totalItems] = await Promise.all([
    Product.find().select("-category").skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  return { products, totalItems };
};

module.exports = {
  createProductService,
  getAllProductByCateService,
  getAllProductService,
};
