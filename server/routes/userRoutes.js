import express from "express";
import { loginUser, registerUser, requestLoginOtp, verifyLoginOtp } from "../Controllers/userControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/request-login-otp", requestLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

export default router;
