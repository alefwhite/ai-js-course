import * as dotenv from "dotenv";

// Carrega as variáveis de ambiente
export function loadEnvironment(): void {
  dotenv.config();
}

// Obtém uma API key do ambiente
export function getApiKey(keyName: string): string {
  const apiKey = process.env[keyName];
  if (!apiKey) {
    throw new Error(
      `${keyName} não encontrada nas variáveis de ambiente. Por favor, configure no arquivo .env`
    );
  }
  return apiKey;
}

// Exibe resultado formatado
export function displayResult(title: string, content: any): void {
  console.log(`\n🚀 ${title}`);
  console.log("=".repeat(50));
  console.log(content);
  console.log("=".repeat(50));
}

// Obtém endpoint configurado
export function getEndpoint(endpointName: string): string {
  const endpoint = process.env[endpointName];
  if (!endpoint) {
    throw new Error(
      `${endpointName} não encontrado nas variáveis de ambiente. Por favor, configure no arquivo .env`
    );
  }
  return endpoint;
}

export function getUpstashKeys(): { url: string; token: string } {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      `UPSTASH_REDIS_REST_URL ou UPSTASH_REDIS_REST_TOKEN não encontrados nas variáveis de ambiente. Por favor, configure no arquivo .env`
    );
  }
  return { url, token };
}
