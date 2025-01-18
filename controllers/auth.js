import bcrypt from "bcryptjs";
import User from "../model/user"
import { registerSchema } from "../Schemas/auth";

// Đăng ký
export const signup = async (req, res) => {
  try {
    const { username, password, confirmPassword, email, age } = req.body;

    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      console.log("Validation errors:", messages);
      return res.status(400).json({ messages });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      age,
    });

    const savedUser = await user.save();
    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

// Đăng nhập
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Lưu thông tin người dùng vào session sau khi đăng nhập thành công
    req.session.userLoggedIn = true;

    req.session.user = {
      username: user.username,
      email: user.email,
      age: user.age,
      avatar: user.avatar || "/assets/default.jpg",
    };

    res.status(200).json({
      message: "Đăng nhập thành công",
      username: user.username,
      avatar: user.avatar || "../public/assets/default.jpg",
    });
  } catch (error) {
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

// Cập nhật password
export const updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
    }

    // Cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Lưu lại thay đổi
    await user.save();

    res.status(200).json({ message: "Cập nhật mật khẩu thành công." });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
};

//cập nhật email
export const updateEmail = async (req, res) => {
  try {
    const { email, newEmail } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Kiểm tra email mới có bị trùng không
    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được đăng ký." });
    }

    // Cập nhật email
    user.email = newEmail;

    // Lưu lại thay đổi
    await user.save();
    req.session.user.email = newEmail;

    res.status(200).json({
      message: "Cập nhật email thành công.",
      user: { email: user.email },
    });
  } catch (error) {
    console.error("Error updating email:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
};
//cập nhật username
export const updateUsername = async (req, res) => {
  try {
    const { email, username } = req.body;
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // Cập nhật username
    user.username = username;

    // Lưu lại thay đổi (hoặc có thể thử updateOne thay vì save)
    await user.save();
    req.session.user.username = username;

    res.status(200).json({
      message: "Cập nhật username thành công.",
      user: { username: user.username },
    });
  } catch (error) {
    console.error("Error updating username:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
};

//cập nhật age
export const updateAge = async (req, res) => {
  try {
    const { email, age } = req.body;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    // Cập nhật tuổi
    user.age = age;
    // Lưu lại thay đổi
    await user.save();
    req.session.user.age = age;
    res.status(200).json({
      message: "Cập nhật tuổi thành công.",
      user: { age: user.age },
    });
  } catch (error) {
    console.error("Error updating age:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
};

export const users = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const countUser = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error counting users:", error.message);
    res.status(500).json({ message: "Đã xảy ra lỗi.", error: error.message });
  }
}