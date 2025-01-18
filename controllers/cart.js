// controllers/cart.js
import mongoose from "mongoose";
import Cart from "../model/cart.js";
import Product from "../model/product.js";

export const addToCart = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { productId, quantity, name, price, image } = req.body;

    // Check if the product exists in the Product model
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product already exists in the cart
    let existingCartItem = await Cart.findOne({ productId });
    if (existingCartItem) {
      // If it exists, update the quantity
      existingCartItem.quantity += quantity;
      const updatedItem = await existingCartItem.save();
      return res.status(200).json(updatedItem);
    }

    // If the product does not exist in the cart, add it
    const cartItem = new Cart({
      productId,
      name,
      price,
      image,
      quantity,
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem); // Return the created cart item
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};


// Get all items in the cart
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId"); // Populate to get product details
    res.status(200).json(cartItems); // Return cart items with product details
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

export const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity, price } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid cart item ID" });
    }

    const existingCartItem = await Cart.findById(productId);
    if (!existingCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const newQuantity = quantity !== undefined ? parseInt(quantity, 10) : existingCartItem.quantity;

    const updatedCartItem = await Cart.findByIdAndUpdate(
      productId,
      {
        quantity: newQuantity,
      },
      { new: true } 
    );

    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Delete a cart item
export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedCartItem = await Cart.findByIdAndDelete(productId);

    if (!deletedCartItem) {
      return res.status(404).send({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Error deleting cart item", error });
  }
};

export const clearCart = async (req, res) => {
  try {
    const deletedCartItems = await Cart.deleteMany({});

    if (deletedCartItems.deletedCount === 0) {
      return res.status(404).send({ message: "No items in cart to delete" });
    }

    res.status(200).json({ message: "All cart items deleted successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error });
  }
};

