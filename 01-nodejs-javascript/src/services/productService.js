const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const Category = require("../models/category");
const Product = require("../models/product");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({ node: "http://localhost:9200" });

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
    const savedProduct = await product.save();

    // ✅ Đồng bộ sang Elasticsearch
    await client.index({
      index: "products",
      id: savedProduct._id.toString(),
      document: {
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        category: savedProduct.category?.toString() || "",
        stock: savedProduct.stock,
        images: savedProduct.images,
        createdAt: savedProduct.createdAt,
        updatedAt: savedProduct.updatedAt,
      },
      refresh: true,
    });

    return savedProduct;
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

const getAllProductByCateService = async (
  cateId,
  search,
  minPrice,
  maxPrice,
  page,
  limit
) => {
  try {
    const from = (page - 1) * limit;

    const range = {};
    if (minPrice !== undefined) range.gte = minPrice;
    if (maxPrice !== undefined) range.lte = maxPrice;

    const query = {
      bool: {
        must: [],
        filter: [{ term: { category: cateId } }], // luôn lọc category
      },
    };

    if (search) {
      query.bool.must.push({
        multi_match: {
          query: search,
          fields: ["name", "description"],
          fuzziness: "AUTO",
          prefix_length: 1,
          max_expansions: 50,
        },
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.bool.filter.push({ range: { price: range } });
    }

    const response = await client.search({
      index: "products",
      from,
      size: limit,
      query,
    });

    const products = response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    const totalItems = response.hits.total.value;

    return { products, totalItems };
  } catch (err) {
    console.error("Elasticsearch query error:", err);
    throw err;
  }
};

const getAllProductService = async (
  search,
  minPrice,
  maxPrice,
  page,
  limit
) => {
  try {
    const from = (page - 1) * limit;

    const range = {};
    if (minPrice !== undefined) range.gte = minPrice;
    if (maxPrice !== undefined) range.lte = maxPrice;

    // Tạo query
    const query = {
      bool: {
        must: [],
        filter: [],
      },
    };

    if (search) {
      query.bool.must.push({
        multi_match: {
          query: search,
          fields: ["name", "description"],
          fuzziness: "AUTO",
          prefix_length: 1,
          max_expansions: 50,
        },
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.bool.filter.push({ range: { price: range } });
    }

    if (query.bool.must.length === 0 && query.bool.filter.length === 0) {
      // Nếu không có search + filter, match_all
      query.bool = { must: { match_all: {} } };
    }

    const response = await client.search({
      index: "products",
      from,
      size: limit,
      query,
    });

    const products = response.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    const totalItems = response.hits.total.value;

    return { products, totalItems };
  } catch (err) {
    console.error("Elasticsearch query error:", err);
    throw err;
  }
};

const getSimilarProductService = async (productId) => {
  try {
    const productExisting = await Product.findById(productId);

    if (!productExisting) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
    }

    const similarProducts = await Product.find({
      category: productExisting.category,
      _id: { $ne: productExisting._id },
    })
      .limit(5)
      .lean();

    console.log(">>>", similarProducts);

    return similarProducts;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getProductDetailService = async (productId) => {
  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new Api(StatusCodes.BAD_REQUEST, "Sản phẩm không tồn tại");
    }
    return existingProduct.populate("category");
  } catch (error) {
    throw new Api(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = {
  createProductService,
  getAllProductByCateService,
  getAllProductService,
  getSimilarProductService,
  getProductDetailService,
};
