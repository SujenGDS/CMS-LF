import jwt from "jsonwebtoken";

const SECRET_KEY = "mysecretkey";

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role: role }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
