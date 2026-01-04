import { Router } from "express";
import { AuthController } from "../controller/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/profile", authMiddleware, authController.getProfile);

export default router;
