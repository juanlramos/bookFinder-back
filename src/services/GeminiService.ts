import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export class GeminiService {
  static async getRecommendations(tags: string[]) {
    try {
      const modelName = "gemini-2.5-flash";

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
        //turned off filters to avoid blocks
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const tagsString = tags.join(", ");
      const prompt = `
        Você é um bibliotecário especialista. 
        O usuário busca livros de FICÇÃO com as seguintes características: ${tagsString}.
        
        Recomende 5 livros que se encaixem nessas tags.
        certifique-se de que os livros existem, caso não existam, não precisa retornar!
        Retorne ESTRITAMENTE um array de objetos JSON.
        
        Siga este formato exato para cada livro:
        [
          {
            "title": "Título do Livro",
            "author": "Nome do Autor",
            "reason": "Uma frase curta de porque esse livro combina com as tags"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      return JSON.parse(text);
    } catch (error: any) {
      // Se der erro de cota (429), avisamos de forma clara
      if (error.status === 429 || error.message?.includes("429")) {
        console.error(
          "COTA EXCEDIDA! O modelo Flash atingiu o limite. Aguarde um pouco.",
        );
        throw new Error(
          "Muitas requisições. Tente novamente em alguns segundos.",
        );
      }

      console.error("Erro no Gemini:", error);
      throw error;
    }
  }
}
