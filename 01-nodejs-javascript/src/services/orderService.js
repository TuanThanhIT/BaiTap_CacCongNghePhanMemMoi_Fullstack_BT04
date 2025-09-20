const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/apiError");
const Cart = require("../models/cart");
const Order = require("../models/order");

// 🛒 Tạo đơn hàng từ giỏ hàng
const createOrderService = async (userId, shippingAddress, paymentMethod) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product"
  );

  if (!cart || cart.products.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Giỏ hàng trống");
  }

  // 💰 Tính tổng giá trị đơn hàng
  const totalPrice = cart.products.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 📝 Tạo order mới
  const order = new Order({
    user: userId,
    products: cart.products.map((p) => ({
      product: p.product._id,
      quantity: p.quantity,
      price: p.product.price,
    })),
    totalPrice,
    status: "pending",
    paymentMethod,
    shippingAddress,
  });

  await order.save();

  // 🗑️ Xóa giỏ hàng sau khi tạo order
  await Cart.findOneAndDelete({ user: userId });

  return order;
};

// 👤 Xem tất cả đơn hàng của user
const getUserOrdersService = async (userId) => {
  return await Order.find({ user: userId })
    .populate("products.product", "name price images")
    .sort({ createdAt: -1 });
};

// 🔎 Xem chi tiết một đơn hàng
const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId).populate(
    "products.product",
    "name price images"
  );
  if (!order)
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");
  return order;
};

// 🛠️ Admin cập nhật trạng thái đơn hàng
const updateOrderStatusService = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (!order)
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");
  return order;
};

// ❌ User hủy đơn hàng
const cancelOrderService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order)
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");

  if (order.status === "pending") {
    order.status = "cancelled";
    await order.save();
    return order;
  } else {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Không thể hủy đơn hàng đã xử lý"
    );
  }
};

module.exports = {
  createOrderService,
  getUserOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService,
};
