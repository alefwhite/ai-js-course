export async function extractConsumerUnit(document: string) {
  const prompt = `Texto da conta de energia:\n\n${document}`;
  return prompt;
}
