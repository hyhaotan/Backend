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

//Controllers
import { addToCart, deleteCartItem, updateCartItem, getCart, clearCart } from "../controllers/cart.js";
import { users, deleteUser, countUser } from "../controllers/auth.js";
import { addProduct, countProduct, deleteProduct, getProduct, getProductEdit, searchProduct, updateProduct } from "../controllers/product.js";
import { getPayment, getTotalRevenue, payment,editorder,deleteorder } from "../controllers/payment.js";

dotenv.config();

const app = express();

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

// Serve Static Files
app.get("/register", (req, res) => {
  res.render("register", { baseUrl: process.env.BASE_URL });
});

app.get("/login", (req, res) => {
  res.render("login", {
    baseUrl: process.env.BASE_URL,
    userLoggedIn: req.session.userLoggedIn || false,
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user || {},
  });
});

app.get("/editprofile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("editprofile", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user,
  });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user || {},
  });
});

app.get("/order", (req, res) => {
  res.render("order", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user || {},
  });
});

app.get("/useraccount", (req, res) => {
  res.render("useraccount", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user || {},
  });
});

app.get("/product", (req, res) => {
  res.render("product", {
    baseUrl: process.env.BASE_URL,
    user: req.session.user || {},
  });
});

app.get("/api/product", getCart);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.put("/api/cart/:productId", updateCartItem);
app.delete("/api/cart/:productId", deleteCartItem);
app.post("/api/product", addToCart);
app.delete('/api/cart', clearCart);

app.get("/api/users", users);
app.delete("/api/users/:id", deleteUser);
app.get("/api/products/count", countProduct);
app.get("/api/users/count", countUser);

app.post("/", addProduct);
app.delete("/api/products/:id", deleteProduct);
app.put('/api/products/:productId', updateProduct);
app.get("/api/product", getProduct);
app.get("/api/products/:productId",getProductEdit);
app.get("/search",searchProduct);

app.get("/api/payment", getPayment);
app.post("/api/payment", payment);
app.get("/api/payments/total-revenue",getTotalRevenue);
app.put('/api/payments/:id', editorder);
app.delete('/api/payments/:id', deleteorder);

export const viteNodeApp = app;
