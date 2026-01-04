import { Router } from "express";
import { PostController } from "../controller/postController";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });
const postController = new PostController();

router.post("/", authMiddleware, postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/my-posts", authMiddleware, postController.getMyPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", authMiddleware, postController.updatePost);
router.delete("/:id", authMiddleware, postController.deletePost);
router.post(
  "/upload-image",
  upload.single("image"),
  postController.uploadPostImage
);

export default router;
