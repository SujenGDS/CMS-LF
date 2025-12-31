import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./db";
import auth from "./routes/auth";
import postRouter from "./routes/postRouter";
import uploadRouter from "./routes/upload";

const app = express();

// Connect Database once
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", auth);
app.use("/posts", postRouter);
app.use("/upload", uploadRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
