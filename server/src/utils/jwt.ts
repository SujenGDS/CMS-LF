import jwt from "jsonwebtoken";
import { serverConfig } from "../config/serverConfig";

const SECRET_KEY = serverConfig.jwt.secret;

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role: role }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
