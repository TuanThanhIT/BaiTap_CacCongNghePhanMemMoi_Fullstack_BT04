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

// GET /v1/api/product?search=...&minPrice=...&maxPrice=...&page=1&limit=10
const getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice)
      : undefined;

    const { products, totalItems } = await getAllProductService(
      search,
      minPrice,
      maxPrice,
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

// GET /v1/api/product/:cateId?search=...&minPrice=...&maxPrice=...&page=1&limit=10
const getAllProductByCate = async (req, res, next) => {
  try {
    const cateId = req.params.cateId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const minPrice = req.query.minPrice
      ? parseFloat(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? parseFloat(req.query.maxPrice)
      : undefined;

    const { products, totalItems } = await getAllProductByCateService(
      cateId,
      search,
      minPrice,
      maxPrice,
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

module.exports = { createProduct, getAllProductByCate, getAllProduct };
