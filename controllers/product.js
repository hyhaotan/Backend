import Product from "../model/product.js";
import mongoose from "mongoose";

// Get all products
export const getProduct = async (req, res) => {
  try {
    const data = await Product.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, model, description, type, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Tên sản phẩm và giá là bắt buộc." });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Giá sản phẩm không hợp lệ." });
    }

    const newProduct = new Product({
      name,
      price: parseFloat(price),
      model,
      description,
      type,
      image,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Thêm sản phẩm thành công.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      message: "Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại sau.",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const { name, type, price, model, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, type, price, model, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error });
  }
};


export const getProductEdit = async (req, res) => {
  const { productId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const countProduct = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ message: "Error counting products", error });
  }
}

export const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const products = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching for products", error });
  }
};


export const getProductRelated = async (req, res) => {
  const { productId } = req.query;

  try {
    // Lấy thông tin sản phẩm hiện tại để biết thuộc tính nào để so sánh (ví dụ: type)
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json([]);
    }

    // Tìm các sản phẩm cùng loại, ngoại trừ sản phẩm hiện tại
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      type: currentProduct.type,
    }).limit(4); // Giới hạn số sản phẩm liên quan trả về (có thể điều chỉnh)

    res.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json([]);
  }
};

