import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.ENABLED_CORS?.split(";") || [],
  }),
);
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
