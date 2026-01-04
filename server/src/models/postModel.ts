import { BaseModel } from "./baseModel";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Post {
  id?: number;
  title: string;
  body: string;
  image?: string;
  tags?: string[];
  author_id: number;
  created_at?: Date;
}

export class PostModel extends BaseModel {
  constructor() {
    super("posts");
  }

  async getAllWithAuthors(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(`
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
    return rows;
  }

  async getByIdWithAuthor(id: number): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
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
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createPost(post: Post): Promise<number> {
    const { title, body, image, tags, author_id } = post;
    const [result] = await pool.query<ResultSetHeader>(
      `
      INSERT INTO posts (title, body, image, tags, author_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [title, body, image || null, JSON.stringify(tags || []), author_id]
    );
    return result.insertId;
  }

  async updatePost(
    id: number,
    authorId: number,
    post: Partial<Post>
  ): Promise<number> {
    const { title, body, image, tags } = post;
    const [result] = await pool.query<ResultSetHeader>(
      `
      UPDATE posts
      SET title = ?, body = ?, image = ?, tags = ?
      WHERE id = ? AND author_id = ?
      `,
      [title, body, image || null, JSON.stringify(tags || []), id, authorId]
    );
    return result.affectedRows;
  }

  async deletePost(id: number, authorId: number): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `DELETE FROM posts WHERE id = ? AND author_id = ?`,
      [id, authorId]
    );
    return result.affectedRows;
  }

  async getPostsByAuthor(authorId: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT *
      FROM posts
      WHERE author_id = ?
      ORDER BY created_at DESC
      `,
      [authorId]
    );
    return rows;
  }
}
