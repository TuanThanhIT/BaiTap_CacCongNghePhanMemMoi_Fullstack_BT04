const {
  createCateService,
  getAllCateService,
} = require("../services/categoryService");

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const cate = await createCateService(name, description);
    return res.status(201).json(cate);
  } catch (error) {
    next(error);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const cates = await getAllCateService();
    return res.status(200).json(cates);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCategory,
  getAllCategory,
};
