import { Request, Response } from "express";
import pool from "../config/db";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body, image, tags } = req.body;
    const userId = (req as any).user.id;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO posts (title, body, image, tags, author_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, body, image || null, JSON.stringify(tags || []), userId]
    );

    res.status(201).json({
      message: "Post created successfully",
      postId: (result as any).insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPosts = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        posts.id,
        posts.title,
        posts.body,
        posts.image,
        posts.tags,
        posts.created_at,
        users.name AS author
      FROM posts
      JOIN users ON users.id = posts.author_id
      ORDER BY posts.created_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `
      SELECT 
        posts.id,
        posts.title,
        posts.body,
        posts.image,
        posts.tags,
        posts.created_at,
        users.name AS author
      FROM posts
      JOIN users ON users.id = posts.author_id
      WHERE posts.id = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;

    const [result]: any = await pool.query(
      `DELETE FROM posts WHERE id = ? AND author_id = ?`,
      [postId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed or post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM posts
      WHERE author_id = ?
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = (req as any).user.id;
    const { title, body, image, tags } = req.body;

    const [result]: any = await pool.query(
      `
      UPDATE posts
      SET title = ?, body = ?, image = ?, tags = ?
      WHERE id = ? AND author_id = ?
      `,
      [title, body, image || null, JSON.stringify(tags || []), postId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Not allowed or post not found" });
    }

    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
