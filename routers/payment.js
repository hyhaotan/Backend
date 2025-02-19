import express from "express";
import { getPayment, getTotalRevenue, payment,editorder,deleteorder, getAllOrders,updateOrderStatus  } from "../controllers/payment.js";
const router = express.Router();

router.get("/api/payment", getPayment);
router.post('/api/payment', payment);
router.get("/api/payments/total-revenue",getTotalRevenue);
router.put('/api/payments/:id', editorder);
router.delete('/api/payments/:id', deleteorder);
router.get("/api/payments", getAllOrders);
router.put("/api/payment/:orderId", updateOrderStatus);

export default router;