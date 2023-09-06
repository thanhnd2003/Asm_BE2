import User from "../model/user.js";
import { signinSchema, signupSchema } from "../schemas/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const showUser = async (req, res) => {
  const user = await User.find();
  return res.json(user);
};

export const getUserByEmail = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({email: email});

  if(user == null) {
    return res.json({
      success: false,
      message: "user khong ton tai"
    })
  }

  const hashedPassword = await bcrypt.compare(password, user.password);
  if(!hashedPassword) {
    return res.json({
      success: false,
      message: "sai password"
    })
  } 

  return res.json({
    success: true,
    data: user,
    message: "dang nhap thanh cong"
  })
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const { error } = signupSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    if(!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Khong Duoc Bo Trong",
      });
    }

    // Check xem email đăng ký này đã tồn tại trong DB hay chưa?
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Nguoi Dung Da Ton Tai",
      });
    }

    // Dùng bcrypt để mã hoá
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với password đã được mã hoá
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Xoá bỏ password trước khi gửi lại thông báo phía client
    const token = jwt.sign({ _id: user._id }, "123456", { expiresIn: "1d" });
    user.password = undefined;
    return res.status(201).json({
      message: "User created successfully",
      user,
      accessToken: token,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = signinSchema.validate(
      { email, password },
      { abortEarly: false }
    );

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Khong dung mat khau",
      });
    }
    const token = jwt.sign({ _id: user._id }, "123456", {
      expiresIn: "1d",
    });

    user.password = undefined;

    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
