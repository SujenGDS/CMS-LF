import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const user = await this.authService.register({ name, email, password });

      res.status(201).json({
        message: "Registered successfully",
        user,
      });
    } catch (err: any) {
      console.error(err);
      const statusCode = err.message === "User already exists" ? 400 : 500;
      res.status(statusCode).json({ message: err.message || "Server error" });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const result = await this.authService.login({ email, password });

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (err: any) {
      console.error(err);
      const statusCode = err.message === "Invalid credentials" ? 400 : 500;
      res.status(statusCode).json({ message: err.message || "Server error" });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const user = await this.authService.getProfile(userId);

      res.status(200).json({
        message: "Profile fetched successfully",
        user,
      });
    } catch (err: any) {
      console.error(err);
      const statusCode = err.message === "User not found" ? 404 : 500;
      res.status(statusCode).json({ message: err.message || "Server error" });
    }
  };
}
