import { v2 as cloudinary } from "cloudinary";
import { serverConfig } from "./serverConfig";

cloudinary.config({
  cloud_name: serverConfig.cloudinary.cloudName,
  api_key: serverConfig.cloudinary.apiKey,
  api_secret: serverConfig.cloudinary.apiSecret,
  secure: true,
});

console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
export default cloudinary;
