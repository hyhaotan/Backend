import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        name: {
          type: String,
          required: [true, "Product name is required"],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be at least 0"],
        },
        totalPrice: {
          type: Number,
          required: true, // Total price = quantity * price
          min: [0, "Total price must be at least 0"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be at least 0"],
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit_card", "bank_transfer"],
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    // Thông tin khách hàng bao gồm tên, email, số điện thoại và địa chỉ
    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Customer phone is required"],
        trim: true,
      },
      address: {
        type: String,
        required: [true, "Customer address is required"],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre("save", function (next) {
  // Tính totalPrice cho từng sản phẩm nếu chưa có
  this.cartItems.forEach((item) => {
    if (!item.totalPrice) {
      item.totalPrice = item.quantity * item.price;
    }
  });

  // Tính tổng số tiền thanh toán
  this.totalAmount = this.cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  if (isNaN(this.totalAmount) || this.totalAmount < 0) {
    return next(new Error("Invalid totalAmount"));
  }

  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
