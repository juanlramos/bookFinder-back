import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  // CORS configuration:
  // - If `ENABLED_CORS` is defined, treat it as a semicolon-separated list of allowed origins.
  // - Otherwise, fall back to allowing all origins (helps avoid silent failures in serverless envs).
  cors({
    origin: process.env.ENABLED_CORS ? process.env.ENABLED_CORS.split(";") : true,
  }),
);
// Temporary debug logging for incoming requests to help diagnose CORS/preflight issues in Vercel
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
  res.send("Backend running!");
});

// Only listen locally, Vercel handles the serverless runtime
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
}

export default app;
