import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

// Definindo o que queremos retornar para o front
export interface BookDetails {
  title: string;
  authors: string[];
  description: string;
  pageCount: number;
  averageRating: number;
  thumbnail: string;
  previewLink: string;
  geminiReason?: string;
}

export class GoogleBooksService {
  static async searchBook(
    title: string,
    author?: string,
  ): Promise<BookDetails | null> {
    try {
      let query = `intitle:${title}`;
      if (author) query += `+inauthor:${author}`;

      const response = await axios.get(GOOGLE_BOOKS_URL, {
        params: {
          q: query,
          key: GOOGLE_API_KEY,
          maxResults: 1, // Queremos só o primeiro (mais provável)
          langRestrict: "pt", // Preferência por livros em português
        },
      });

      if (!response.data.items || response.data.items.length === 0) {
        return null;
      }

      const bookData = response.data.items[0].volumeInfo;

      // Retorna o objeto formatado e limpo
      return {
        title: bookData.title,
        authors: bookData.authors || ["Autor desconhecido"],
        description: bookData.description || "Sem descrição disponível.",
        pageCount: bookData.pageCount || 0,
        averageRating: bookData.averageRating || 0,
        // Tenta pegar a capa grande, se não tiver pega a pequena
        thumbnail:
          bookData.imageLinks?.thumbnail ||
          bookData.imageLinks?.smallThumbnail ||
          "",
        previewLink: bookData.previewLink,
      };
    } catch (error) {
      console.error(`Erro ao buscar no Google Books (${title}):`, error);
      return null;
    }
  }
}
