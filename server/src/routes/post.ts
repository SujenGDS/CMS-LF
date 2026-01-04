import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  getMyPosts,
  updatePost,
  uploadPostImage,
} from "../controller/postController";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts);
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/upload-image", upload.single("image"), uploadPostImage);

export default router;
