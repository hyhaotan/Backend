import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import { connectDB } from "./config/db.js";

//Routers
import productRouter from "./routers/product.js";
import authRouter from "./routers/auth.js";
import cartRoutes from "./routers/cart.js";
import paymentRouter from "./routers/payment.js"
import adminRoutes from './routers/admin.js';

//Controllers
import { addToCart, deleteCartItem, updateCartItem, getCart, clearCart } from "../controllers/cart.js";
import { users, deleteUser, countUser } from "../controllers/auth.js";
import { addProduct, countProduct, deleteProduct, getProduct, getProductEdit, searchProduct, updateProduct,getProductRelated } from "../controllers/product.js";
import { getPayment, getTotalRevenue, payment, editorder, deleteorder, getAllOrders, updateOrderStatus } from "../controllers/payment.js";

import { requireAdminAuth,requireUserAuth } from '../middleware/auth.js';

import {contact} from "../controllers/contact.js"

dotenv.config();

const app = express();
const baseUrl = process.env.BASE_URL;

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
connectDB(process.env.DB_URI);

// Views and View Engine
const __dirname = path.resolve();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/cart", cartRoutes);
app.use("/payment", paymentRouter);
app.use('/', adminRoutes);

// Serve Static Files
app.get("/register", (req, res) => {
  res.render("register", { baseUrl });
});

app.get("/login", (req, res) => {
  res.render("login", {
    baseUrl,
    userLoggedIn: req.session.userLoggedIn || false,
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    baseUrl,
    user: req.session.user || {},
  });
});

app.get("/orderhistory", (req, res) => {
  res.render("orderhistory", {
    baseUrl,
    user: req.session.user || {},
  });
});

app.get("/editprofile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("editprofile", {
    baseUrl,
    user: req.session.user,
  });
});

app.get("/dashboard", requireAdminAuth, (req, res) => {
  res.render("dashboard", {
    baseUrl: process.env.BASE_URL || '',
    user: req.session.user || {},
  });
});

app.get("/order", requireAdminAuth, (req, res) => {
  res.render("order", {
    baseUrl,
    user: req.session.user || {},
  });
});

app.get("/useraccount", requireAdminAuth, (req, res) => {
  res.render("useraccount", {
    baseUrl,
    user: req.session.user || {},
  });
});

app.get("/product", requireAdminAuth, (req, res) => {
  res.render("product", {
    baseUrl,
    user: req.session.user || {},
  });
});

app.get("/api/product", getCart);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Cart
app.put("/api/cart/:productId", updateCartItem);
app.delete("/api/cart/:productId", deleteCartItem);
app.post("/api/product", addToCart);
app.delete('/api/cart', clearCart);

// Useraccount
app.get("/api/users", users);
app.delete("/api/users/:id", deleteUser);
app.get("/api/products/count", countProduct);
app.get("/api/users/count", countUser);

// Product
app.post("/", addProduct);
app.delete("/api/products/:id", deleteProduct);
app.put('/api/products/:productId', updateProduct);
app.get("/api/product", getProduct);
app.get("/api/products/:productId", getProductEdit);
app.get("/search", searchProduct);
app.get("/api/products",getProductRelated);

// Payment
app.get("/api/payment", getPayment);
app.post("/api/payment", payment);
app.get("/api/payments/total-revenue", getTotalRevenue);
app.put('/api/payments/:id', editorder);
app.delete('/api/payments/:id', deleteorder);
app.get("/api/payments", getAllOrders);
app.put("/api/payment/:orderId", updateOrderStatus);

// Contact
app.post('/contact',contact);

export const viteNodeApp = app;
