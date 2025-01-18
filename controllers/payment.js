import Payment from "../model/payment.js";

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
    const { cartItems, paymentMethod } = req.body;

    if (!cartItems || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin giỏ hàng hoặc phương thức thanh toán" });
    }

    // Calculate total amount here to make sure it's accurate before sending it to the model
    let totalAmount = 0;
    cartItems.forEach((item) => {
      if (!item.price || !item.quantity) {
        return res.status(400).json({ success: false, message: "Sản phẩm thiếu giá hoặc số lượng" });
      }
      item.totalPrice = item.price * item.quantity;
      totalAmount += item.totalPrice;
    });

    // Create payment object and save it to database
    const newPayment = new Payment({
      cartItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
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
