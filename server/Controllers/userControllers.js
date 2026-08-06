import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendLoginOtpEmail from "../services/emailService.js";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be configured in production.");
  return "development-only-change-me";
};

const createToken = (userId) => jwt.sign({ userId }, getJwtSecret(), { expiresIn: "1d" });

const publicUser = (user) => ({ id: user._id, fullName: user.fullName, email: user.email });

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
    return res.status(201).json({ success: true, message: "Registration successful.", user: publicUser(user) });
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

    return res.status(200).json({ success: true, token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to log in." });
  }
};

export const requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+loginOtpHash +loginOtpExpiresAt");
    if (user) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      user.loginOtpHash = crypto.createHash("sha256").update(otp).digest("hex");
      user.loginOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      try {
        await sendLoginOtpEmail({ email: user.email, fullName: user.fullName, otp });
      } catch (emailError) {
        user.loginOtpHash = undefined;
        user.loginOtpExpiresAt = undefined;
        await user.save();
        throw emailError;
      }
    }

    return res.status(200).json({ success: true, message: "If an account exists for this email, a one-time code has been sent." });
  } catch (error) {
    const message = error.message === "Email service is not configured."
      ? "Email OTP is not configured yet. Set RESEND_API_KEY and EMAIL_FROM on the backend."
      : "Unable to send the one-time code. Please try again.";
    return res.status(503).json({ success: false, message });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+loginOtpHash +loginOtpExpiresAt");
    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (!user || !user.loginOtpHash || user.loginOtpHash !== otpHash || user.loginOtpExpiresAt < new Date()) {
      return res.status(401).json({ success: false, message: "The code is invalid or has expired." });
    }

    user.loginOtpHash = undefined;
    user.loginOtpExpiresAt = undefined;
    await user.save();
    return res.status(200).json({ success: true, token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to verify the one-time code." });
  }
};
