import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { serverConfig } from "./config/serverConfig";
import apiRoutes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/", (_req, res) => {
  res.send("API is running");
});

const PORT = serverConfig.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
