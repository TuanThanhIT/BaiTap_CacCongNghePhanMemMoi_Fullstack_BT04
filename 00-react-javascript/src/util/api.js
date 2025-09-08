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
const getAllProducts = async (
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

export {
  createUserApi,
  loginApi,
  getUserApi,
  getAllCateApi,
  getProductsByCateApi,
  getAllProducts,
};
