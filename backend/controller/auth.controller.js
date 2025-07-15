import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// SIGNUP
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body; // ✅ use username
  if (!email || !password || !username) {
    return next(errorHandler(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(errorHandler(400, "Email already exists"));

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = new User({ username, email, password: hashedPassword }); // ✅ username

  await user.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

// SIGNIN
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(errorHandler(404, "User not found"));

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return next(errorHandler(400, "Invalid credentials"));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res
    .cookie("access_token", token, {
      httpOnly: true,
      sameSite: "None", // ✅ Required for Vercel + Render
      secure: true,     // ✅ Required for HTTPS
    })
    .status(200)
    .json({
      success: true,
      user: {
        id: user._id,
        username: user.username, // ✅ renamed
        email: user.email,
      },
    });
};

// SIGNOUT
export const signout = async (req, res, next) => {
  res
    .clearCookie("access_token", {
      sameSite: "None",
      secure: true,
    })
    .status(200)
    .json({ success: true, message: "User logged out" });
};
