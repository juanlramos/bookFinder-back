import { Router } from "express";
import { BookController } from "../controllers/BookController";

const router = Router();

// Search for Gemini recommendations
router.post("/recommend", BookController.recommend);

export { router };
