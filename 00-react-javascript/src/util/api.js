import instance from "./axios.customize";

const createUserApi = async (name, email, password) => {
  const URL_API = "/v1/api/register";

  const data = {
    name,
    email,
    password,
  };
  return instance.post(URL_API, data);
};

const loginApi = async (email, password) => {
  const URL_API = "/v1/api/login";

  const data = {
    email,
    password,
  };
  return instance.post(URL_API, data);
};

const getUserApi = async () => {
  const URL_API = "/v1/api/users";
  return instance.get(URL_API);
};

const getAllCateApi = async () => {
  const URL_API = "/v1/api/category";
  return instance.get(URL_API);
};

// util/api.js

// Lấy sản phẩm theo category + search + min/max price + phân trang
const getProductsByCateApi = async (
  cateId,
  page = 1,
  limit = 2,
  search = "",
  minPrice,
  maxPrice
) => {
  let URL_API = `/v1/api/product/${cateId}?page=${page}&limit=${limit}`;

  if (search) URL_API += `&search=${encodeURIComponent(search)}`;
  if (minPrice !== undefined) URL_API += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined) URL_API += `&maxPrice=${maxPrice}`;

  return instance.get(URL_API);
};

// Lấy tất cả sản phẩm + search + min/max price + phân trang
const getAllProductsApi = async (
  page = 1,
  limit = 2,
  search = "",
  minPrice,
  maxPrice
) => {
  let URL_API = `/v1/api/product?page=${page}&limit=${limit}`;

  if (search) URL_API += `&search=${encodeURIComponent(search)}`;
  if (minPrice !== undefined) URL_API += `&minPrice=${minPrice}`;
  if (maxPrice !== undefined) URL_API += `&maxPrice=${maxPrice}`;

  return instance.get(URL_API);
};

const addFavoriteApi = async (productId) => {
  let URL_API = `/v1/api/addFavorite/${productId}`;
  return instance.post(URL_API);
};

const getFavoritesApi = async () => {
  let URL_API = `/v1/api/favorites`;
  return instance.get(URL_API);
};

const deleteFavoriteApi = async (productId) => {
  let URL_API = `/v1/api/deleteFavorite/${productId}`;
  return instance.delete(URL_API);
};

const getProductDetail = async (productId) => {
  let URL_API = `/v1/api/productDetail/${productId}`;
  return instance.get(URL_API);
};

const postCommentProductApi = async (productId, rating, content) => {
  let URL_API = `v1/api/addComment/${productId}`;
  const data = {
    rating,
    content,
  };
  return instance.post(URL_API, data);
};

const getCommentsProductApi = async (productId) => {
  let URL_API = `v1/api/comments/${productId}`;
  return instance.get(URL_API);
};

const getRelatedProductApi = async (productId) => {
  let URL_API = `v1/api/relatedProduct/${productId}`;
  return instance.get(URL_API);
};

const getViewedApi = async () => {
  let URL_API = `v1/api/viewed`;
  return instance.get(URL_API);
};

const postViewedApi = async (productId) => {
  let URL_API = `v1/api/addViewed/${productId}`;
  return instance.post(URL_API);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  getAllCateApi,
  getProductsByCateApi,
  getAllProductsApi,
  addFavoriteApi,
  getFavoritesApi,
  deleteFavoriteApi,
  getProductDetail,
  postCommentProductApi,
  getCommentsProductApi,
  getRelatedProductApi,
  getViewedApi,
  postViewedApi,
  countCommentsApi,
};
