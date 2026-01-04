import { Request, Response } from "express";
import { PostService } from "../services/postService";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  createPost = async (req: Request, res: Response) => {
    try {
      const { title, body, image, tags } = req.body;
      const userId = req.user!.id;

      const postId = await this.postService.createPost({
        title,
        body,
        image,
        tags,
        author_id: userId,
      });

      res.status(201).json({
        message: "Post created successfully",
        postId,
      });
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ message: err.message || "Server error" });
    }
  };

  getAllPosts = async (_req: Request, res: Response) => {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  getPostById = async (req: Request, res: Response) => {
    try {
      const post = await this.postService.getPostById(Number(req.params.id));
      res.status(200).json(post);
    } catch (err: any) {
      console.error(err);
      res.status(404).json({ message: err.message || "Server error" });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = req.user!.id;
      const { title, body, image, tags } = req.body;

      await this.postService.updatePost(postId, userId, {
        title,
        body,
        image,
        tags,
      });

      res.status(200).json({ message: "Post updated successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(403).json({ message: err.message || "Server error" });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const postId = Number(req.params.id);
      const userId = req.user!.id;

      await this.postService.deletePost(postId, userId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err: any) {
      console.error(err);
      res.status(403).json({ message: err.message || "Server error" });
    }
  };

  getMyPosts = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const posts = await this.postService.getMyPosts(userId);
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  uploadPostImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const url = await this.postService.uploadImage(req.file.path);

      res.status(200).json({
        success: true,
        url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  };
}
