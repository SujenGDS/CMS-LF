import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controller/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getProfile);

export default router;
