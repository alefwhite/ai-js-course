import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";

import {
  loadEnvironment,
  getApiKey,
  displayResult,
  getUpstashKeys,
} from "../../utils/helpers";

loadEnvironment();

const { url, token } = getUpstashKeys();

const cache = new UpstashRedisCache({
  config: {
    url,
    token,
  },
  ttl: 3600,
});

async function main(): Promise<void> {
  try {
    const modelName = process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash";
    const systemMessage = "You are a helpful assistant.";
    const userMessage = "What is the capital of Brazil?";

    const ai = new ChatGoogleGenerativeAI({
      apiKey: getApiKey("GEMINI_API_KEY"),
      model: modelName,
      maxOutputTokens: 1000,
      cache,
    });

    const response = await ai.invoke([
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ]);

    // 5. Exibe o resultado
    displayResult("Gemini API - Text Generation", response.text);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
