const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // tham chiếu đến Category
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String, // url ảnh
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
