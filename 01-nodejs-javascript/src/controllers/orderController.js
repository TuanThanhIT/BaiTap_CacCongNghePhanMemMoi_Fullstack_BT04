const { StatusCodes } = require("http-status-codes");
const {
  createOrderService,
  getUserOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
} = require("../services/orderService");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;
    const order = await createOrderService(
      userId,
      shippingAddress,
      paymentMethod
    );
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Tạo đơn hàng thành công", order });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await getOrderByIdService(req.params.orderId);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatusService(
      req.params.orderId,
      req.body.status
    );
    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await cancelOrderService(req.params.orderId);
    res.json({ message: "Đã hủy đơn hàng", order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
