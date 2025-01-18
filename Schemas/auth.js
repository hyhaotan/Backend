import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
        "string.min": "Tên người dùng phải có ít nhất 3 ký tự",
        "string.empty": "Tên người dùng không được để trống",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "string.empty": "Email không được để trống",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
        "string.empty": "Mật khẩu không được để trống",
    }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
        "any.only": "Mật khẩu xác nhận không khớp",
        "any.required": "Xác nhận mật khẩu không được để trống",
    }),
    age: Joi.number().min(1).max(99).optional().messages({
        "number.min": "Tuổi phải là số dương",
    }),
});
