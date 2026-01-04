import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, User, UserProfile } from "../models/userModel";
import { serverConfig } from "../config/serverConfig";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class AuthService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  async register(
    data: RegisterData
  ): Promise<{ id: number; name: string; email: string }> {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error("All fields required");
    }

    const userExists = await this.userModel.emailExists(email);
    if (userExists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await this.userModel.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: userId,
      name,
      email,
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id },
      serverConfig.jwt.secret as string,
      {
        expiresIn: serverConfig.jwt.expiresIn,
      } as jwt.SignOptions
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getProfile(userId: number): Promise<UserProfile> {
    const profile = await this.userModel.getUserProfile(userId);
    if (!profile) {
      throw new Error("User not found");
    }
    return profile;
  }

  verifyToken(token: string): { id: number } {
    try {
      const decoded = jwt.verify(token, serverConfig.jwt.secret) as {
        id: number;
      };
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}
