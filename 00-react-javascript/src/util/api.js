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

export { createUserApi, loginApi, getUserApi };
