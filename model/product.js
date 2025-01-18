import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  model: { type: String, default: "Không xác định" },
  description: { type: String, default: "Không có mô tả" },
  type: { type: String, default: "Chung" },
  image: { type: String, default: "default-image.jpg" },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
