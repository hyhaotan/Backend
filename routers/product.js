//./routers/product.js
import express from "express";
import {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductEdit,
  searchProduct,
  getProductRelated
} from "../controllers/product.js";

const router = express.Router();

router.get("/products", getProduct);
router.post("/", addProduct);
router.put('/api/products/:productId', updateProduct);
router.delete('/api/products/:id', deleteProduct);
router.get('/api/products/:productId',getProductEdit);
router.get("/search",searchProduct);
router.get("/api/products",getProductRelated);
export default router;
