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
const getProductsByCateApi = async (cateId, page = 1, limit = 2) => {
  const URL_API = `/v1/api/product/${cateId}?page=${page}&limit=${limit}`;
  return instance.get(URL_API);
};

const getAllProducts = async (page = 1, limit = 2) => {
  const URL_API = `/v1/api/product?page=${page}&limit=${limit}`;
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
