import Admin from '../model/admin';

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.render('adminLogin', { error: 'Tài khoản không tồn tại', baseUrl: process.env.BASE_URL || '' });
    }
    
    if (admin.password !== password) {
      return res.render('adminLogin', { error: 'Mật khẩu không đúng', baseUrl: process.env.BASE_URL || '' });
    }
    
    req.session.admin = admin; 
    
    res.redirect(`${process.env.BASE_URL || ''}/dashboard`);
    
  } catch (error) {
    console.error(error);
    res.render('adminLogin', { error: 'Đã xảy ra lỗi, vui lòng thử lại', baseUrl: process.env.BASE_URL || '' });
  }
};
