import express from "express";
import { signup, signin, updatePassword, updateEmail, updateUsername, updateAge } from "../controllers/auth.js";
import { deleteCartItem, updateCartItem,addToCart,getCart } from "../controllers/cart.js";
import { getProduct,addProduct} from "../controllers/product.js";
import {contact} from "../controllers/contact.js"
const router = express.Router();

// Đăng ký
router.post("/signup", signup);

// Đăng nhập
router.post("/signin", signin);

//cập nhật password
router.put("/update-password", updatePassword);

// Cập nhật email
router.put("/update-email", updateEmail);

// Cập nhật username
router.put("/update-username", updateUsername);

// Cập nhật tuổi
router.put("/update-age", updateAge);

// Cart routes
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.put("/cart/:productId", updateCartItem);
router.delete("/cart/:productId", deleteCartItem);

// Product route
router.get("/products", getProduct);
router.post("/products", addProduct);

// Contact route
router.post("/contact",contact);
export default router;
