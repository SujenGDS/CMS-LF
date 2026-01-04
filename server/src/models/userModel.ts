import { BaseModel } from "./baseModel";
import pool from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  created_at?: Date;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export class UserModel extends BaseModel {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createUser(user: User): Promise<number> {
    const { name, email, password } = user;
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );
    return result.insertId;
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [userId]
    );
    return rows.length > 0 ? (rows[0] as UserProfile) : null;
  }

  async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    return rows.length > 0;
  }
}
