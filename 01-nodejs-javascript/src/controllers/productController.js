const {
  createProductService,
  getAllProductByCateService,
  getAllProductService,
} = require("../services/productService");
const uploadFile = require("../utils/upload");
const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, cateId, stock } = req.body;
    const images = [];
    const files = req.files;
    for (const file of files) {
      const upload = await uploadFile(file.path);
      const image = upload.secure_url || null;
      images.push(image);
    }
    const product = await createProductService(
      name,
      price,
      description,
      cateId,
      stock,
      images
    );
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getAllProductByCate = async (req, res, next) => {
  try {
    const cateId = req.params.cateId;

    // Lấy page và limit từ query string (mặc định page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Gọi service phân trang theo category
    const { products, totalItems } = await getAllProductByCateService(
      cateId,
      page,
      limit
    );

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    // Lấy page và limit từ query string (mặc định page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Gọi service phân trang theo category
    const { products, totalItems } = await getAllProductService(page, limit);

    return res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getAllProductByCate, getAllProduct };
