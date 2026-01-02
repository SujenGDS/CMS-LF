import dotenv from "dotenv";
dotenv.config();

export const serverConfig = {
  db: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    name: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT) || 3306,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "mysecretkey",
    expiresIn: process.env.JWT_EXPIRES || "7d",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  },
  server: {
    port: Number(process.env.PORT) || 5000,
  },
};
