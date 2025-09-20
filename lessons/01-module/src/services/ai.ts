import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { getApiKey, getUpstashKeys, loadEnvironment } from "../utils/helpers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

loadEnvironment();

const { url, token } = getUpstashKeys();

const cache = new UpstashRedisCache({
  config: {
    url,
    token,
  },
  ttl: 3600,
});

const modelName = process.env.GEMINI_CHAT_MODEL || "gemini-1.5-flash";

export const AI = new ChatGoogleGenerativeAI({
  apiKey: getApiKey("GEMINI_API_KEY"),
  model: modelName,
  maxOutputTokens: 1000,
  cache,
});
