const {
  addCommentProductService,
  getCommentProductService,
} = require("../services/commentService");

const addCommentProduct = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { content, rating } = req.body;
    const comment = await addCommentProductService(
      userId,
      productId,
      content,
      rating
    );
    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const getProductComments = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const productComments = await getCommentProductService(productId);
    return res.status(200).json(productComments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCommentProduct,
  getProductComments,
};
