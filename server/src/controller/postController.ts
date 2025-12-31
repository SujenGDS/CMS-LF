import { Request, Response } from "express";
import Post from "../models/PostModel";
import User from "../models/userModel";

// Create a new content
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, author, image, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.create({
      title,
      body,
      author: user.name,
      // category,
      tags,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      message: "post created successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts
export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (post.author !== user.name) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts by author (My Posts)
export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user) {
      return res.status(400).json({ message: "Author is required" });
    }

    const posts = await Post.find({ author: user.name });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (post.author !== user.name) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this post" });
    }

    const { title, body, category, image, tags } = req.body;

    post.title = title ?? post.title;
    post.body = body ?? post.body;
    // post.category = category ?? post.category;
    post.image = image ?? post.image;
    post.tags = tags ?? post.tags;
    post.updatedAt = new Date();

    await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
