import { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService";

export class BookController {
  static async recommend(req: Request, res: Response) {
    try {
      const { tags } = req.body;

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({
          error:
            "Você precisa enviar tags para a busca (ex: 'ficção', 'aventura').",
        });
      }

      const recommendations = await GeminiService.getRecommendations(tags);

      return res.json(recommendations);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar recomendações." });
    }
  }
}
