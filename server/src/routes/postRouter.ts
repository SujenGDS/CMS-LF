import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  getMyPosts,
  updatePost,
} from "../controller/postController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/myPosts", authMiddleware, getMyPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
