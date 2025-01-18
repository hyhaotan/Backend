import express from "express";
import { getPayment, getTotalRevenue, payment } from "../controllers/payment.js";
const router = express.Router();

router.get("/api/payment", getPayment);
router.post('/api/payment', payment);
router.get("/api/payments/total-revenue",getTotalRevenue);
export default router;