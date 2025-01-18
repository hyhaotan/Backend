import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  productId: { type: String, ref: 'Product', required: true },
  name: { type: String, required: true }, 
  price: { type: Number, required: true, min: 0 }, 
  image: { type: String, required: true }, 
  quantity: { type: Number, required: true, min: 1 }, 
});

export default mongoose.model("Cart", CartSchema);
