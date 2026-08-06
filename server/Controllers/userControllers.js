import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be configured in production.");
  return "development-only-change-me";
};

const createToken = (userId) => jwt.sign({ userId }, getJwtSecret(), { expiresIn: "1d" });

export const registerUser = async (req, res) => {
  try {
    const { fullName, employeeId, email, department, password } = req.body;
    if (![fullName, employeeId, email, department, password].every(Boolean)) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const user = await User.create({ fullName, employeeId, email, department, password });
    return res.status(201).json({ success: true, message: "Registration successful.", user: {
      id: user._id, fullName: user.fullName, email: user.email,
    } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error("User registration failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to register user." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.status(200).json({ success: true, token: createToken(user._id), user: {
      id: user._id, fullName: user.fullName, email: user.email,
    } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to log in." });
  }
};
