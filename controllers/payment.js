import Payment from "../model/payment.js";
import mongoose from "mongoose";

export const getPayment = async (req, res) => {
  try {
    const data = await Payment.find();
    if (data.length === 0) {
      return res.status(404).json({ message: "No payment found" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

export const payment = async (req, res) => {
  try {
    const { cartItems, paymentMethod, customer } = req.body;

    if (!cartItems || !paymentMethod || !customer || !customer.phone) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu thông tin giỏ hàng, phương thức thanh toán hoặc thông tin khách hàng (số điện thoại bắt buộc)",
      });
    }
    let totalAmount = 0;
    for (const item of cartItems) {
      if (!item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Sản phẩm thiếu giá hoặc số lượng",
        });
      }
      item.totalPrice = item.price * item.quantity;
      totalAmount += item.totalPrice;
    }

    const newPayment = new Payment({
      cartItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus:"not_received",
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });

    await newPayment.save();

    res.status(201).json({
      success: true,
      message: "Thanh toán thành công",
      payment: newPayment,
    });
  } catch (error) {
    console.error("Error in payment:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi trong quá trình thanh toán",
      error,
    });
  }
};


export const getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({ totalRevenue: totalRevenue[0]?.totalRevenue || 0 });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ message: "Error fetching total revenue" });
  }
};

export const editorder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Trạng thái đơn hàng không được để trống" });
    }

    const updatedOrder = await Payment.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error });
  }
};

export const deleteorder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }

    const deletedOrder = await Payment.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json({
      message: "Xóa đơn hàng thành công",
      order: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Payment.find({}).sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Lỗi khi tải đơn hàng", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId  } = req.params;
    const { orderStatus } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(orderId )) {
      return res.status(400).json({ message: "Id không hợp lệ" });
    }
    
    if (!orderStatus) {
      return res.status(400).json({ message: "Trạng thái đơn hàng không được để trống" });
    }
    
    const updatedOrder = await Payment.findByIdAndUpdate(
      orderId ,
      { orderStatus: orderStatus },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đơn hàng", error });
  }
};
