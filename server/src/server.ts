import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import auth from "./routes/auth";
import postRouter from "./routes/postRouter";
import uploadRouter from "./routes/upload";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/posts", postRouter);
app.use("/upload", uploadRouter);

app.get("/", (_req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
