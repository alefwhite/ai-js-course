import { HumanMessage } from "@langchain/core/messages";
import * as path from "path";
import * as fs from "fs";
import { AI } from "../services/ai";

const filePath = path.join(process.cwd(), "src/files", "Screenshot_3.png");

function imageToLangChainMessageContent(filePath: string, mimeType: string) {
  const data = fs.readFileSync(filePath);
  return {
    type: "image_url",
    image_url: `data:${mimeType};base64,${Buffer.from(data).toString(
      "base64"
    )}`,
  };
}

export async function transcribeImageWithLangChain() {
  try {
    // Defina o caminho para a sua imagem
    const mimeType = "image/png";

    // Prepare o conteúdo da mensagem do usuário com texto e a imagem
    const userMessageContent = [
      { type: "text", text: "Transcreva todo o texto contido nesta imagem." },
      imageToLangChainMessageContent(filePath, mimeType),
    ];

    // 3. Crie a mensagem do usuário (HumanMessage)
    const userMessage = new HumanMessage({ content: userMessageContent });

    // 4. Invoque o modelo com a mensagem
    const response = await AI.invoke([userMessage]);

    // 5. Exiba a resposta
    console.log("--- Texto Transcrito ---");
    console.log(response.content.toString());
    return response.content.toString();
  } catch (error) {
    console.error("Ocorreu um erro ao transcrever o texto:", error);
  }
}
