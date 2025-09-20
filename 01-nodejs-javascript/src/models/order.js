const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: Number, // giá tại thời điểm đặt hàng
      },
    ],
    totalPrice: Number,
    status: { type: String, default: "pending" }, // pending, shipped, done, cancel...
    paymentMethod: { type: String, default: "cod" },
    shippingAddress: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
