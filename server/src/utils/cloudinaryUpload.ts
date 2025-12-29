import cloudinary from "../config/cloudinary";
import * as streamifier from "streamifier";

export const uploadToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
