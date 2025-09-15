const {
  createUserService,
  handleLogin,
  getUserService,
} = require("../services/userService");

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const data = await createUserService(name, email, password);
  return res.status(200).json(data);
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await handleLogin(email, password);
  return res.status(200).json(data);
};

const getUser = async (req, res) => {
  const data = await getUserService();
  return res.status(200).json(data);
};

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};
module.exports = {
  createUser,
  userLogin,
  getUser,
  getAccount,
};
