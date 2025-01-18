import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routers/product.js"

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", productRoutes);
// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/Backend", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
