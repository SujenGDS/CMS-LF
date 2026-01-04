import { Router } from "express";
import auth from "./auth";
// import postRouter from "./post";
import post from "./post";

const router = Router();

// API routes
router.use("/auth", auth);
router.use("/posts", post);

export default router;
