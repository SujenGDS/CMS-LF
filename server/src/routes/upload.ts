import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "posts",
    });

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
