import express from "express";
import { deleteCartItem, updateCartItem,addToCart,getCart, clearCart } from "../controllers/cart.js";
const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.put("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", deleteCartItem);
router.delete('/api/cart/', clearCart);

export default router;
