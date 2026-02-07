import { Request, Response } from "express";
import { GeminiService } from "../services/GeminiService";
import { GoogleBooksService } from "../services/GoogleBooksService";
import { error } from "node:console";

export class BookController {
  static async recommend(req: Request, res: Response) {
    try {
      const { tags } = req.body;

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res
          .status(400)
          .json({ error: "Envie as tags para a pesquisa." });
      }

      const geminiRecommendations =
        await GeminiService.getRecommendations(tags);

      const enrichedBooksPromises = geminiRecommendations.map(
        async (geminiBook: any) => {
          const details = await GoogleBooksService.searchBook(
            geminiBook.title,
            geminiBook.author,
          );

          // Se achou no Google, mistura os dados. Se não, retorna só o que o Gemini deu.
          if (details) {
            return {
              ...details,
              reason: geminiBook.reason, // Mantém a explicação legal da IA
            };
          } else {
            // Fallback: Se o Google Books não achar, devolve o básico do Gemini
            return {
              title: geminiBook.title,
              authors: [geminiBook.author],
              reason: geminiBook.reason,
              thumbnail: "https://via.placeholder.com/128x190?text=Sem+Capa", // Imagem genérica
            };
          }
        },
      );

      const finalResults = await Promise.all(enrichedBooksPromises);

      return res.json(finalResults);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro interno ao buscar recomendações." });
    }
  }
}
