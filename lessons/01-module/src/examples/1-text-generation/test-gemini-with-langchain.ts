import { displayResult } from "../../utils/helpers";
import { transcribeImageWithLangChain } from "../../utils/transcribe-image";
import { AI } from "../../services/ai";

export interface EnergyBillData {
  customer_number: string | null;
  installation_number: string | null;
  connection_type: "MONOFASICO" | "BIFASICO" | "TRIFASICO" | null;
  tariff_type: "A4" | "B1" | "B2" | "B3" | null;
  consumption_in_kwh: number | null;
  last_energy_bill_in_cents: number | null;
}

function extractJsonFromString(rawString: string): string {
  // Regex para encontrar o bloco de código Markdown com o JSON
  const regex = /```json\n([\s\S]*?)\n```/;
  const match = rawString.match(regex);

  // Se o regex encontrar uma correspondência, retorne o grupo 1 (o conteúdo do JSON)
  if (match && match[1]) {
    return match[1].trim(); // Use .trim() para remover espaços em branco extras
  }

  // Se não houver formatação, retorne a string original (caso o prompt tenha funcionado)
  return rawString.trim();
}

async function main(): Promise<void> {
  try {
    const systemMessage = `Você é um agente especialista em interpretar **contas de energia elétrica brasileiras em português**.

Receberá como entrada o texto bruto convertido de um PDF de conta de energia.  
Esses textos podem estar desorganizados, quebrados em várias linhas e com diferentes nomes para os campos.  

Seu objetivo é **extrair os seguintes campos** e retornar em **JSON válido**, no formato:

{
  "customer_number": "string",
  "installation_number": "string",
  "connection_type": "MONOFASICO | BIFASICO | TRIFASICO",
  "tariff_type": "A4 | B1 | B2 | B3",
  "consumption_in_kwh": 0,
  "last_energy_bill_in_cents": 0
}

### Regras de extração:
1. **customer_number** → número do cliente ou conta contrato. Pode aparecer como "Número do Cliente", "Conta Contrato", "Cliente", "Nº do Cliente".
2. **installation_number** → número da instalação ou unidade consumidora.  
   Pode aparecer como:  
   - "Nº da Instalação", "Instalação", "INSTALAÇÃO", "Instalação / Unidade Consumidora".  
   - "Unidade Consumidora", "UC", "UC nº".  
   - Em alguns casos pode aparecer apenas como "Nº" (sem descrição), geralmente próximo ao "Nº do Cliente".  
   Deve ser diferente do número do cliente.
3. **connection_type** → classificar em MONOFASICO, BIFASICO ou TRIFASICO. Pode aparecer como "Monofásico", "Bifásico", "Trifásico" ou dentro da classificação da tarifa (ex: "Convencional B1 Residencial - Trifásico").
4. **tariff_type** → classificar em A4, B1, B2 ou B3. O tipo da tarifa pode aparecer como (ex: "Convencional B1 Residencial", "Rural", "Branca", etc).
5. **consumption_in_kwh** → consumo de energia em kWh (número inteiro). Pode aparecer como "Consumo Uso Sistema", "Consumo kWh", "Energia Elétrica kWh", "kWh". Sempre somar os valores principais de consumo (não considerar “Adicional de Bandeira” como consumo).
6. **last_energy_bill_in_cents** → valor total da fatura em centavos. Buscar o campo "Total a Pagar". Exemplo: se for "7.123,29" → retornar em centavos.

### Instruções finais:
- Se algum campo não for encontrado, retorne null.
- Nunca invente dados.
- Retorne **exclusivamente o JSON**, sem explicações, sem texto adicional, sem formatação de código (como as crases ou a palavra 'json').

### Nota adicional:
- Se houver dois números seguidos de "Nº" (como "Nº do Cliente" e outro apenas "Nº ..."), assuma que o primeiro é o \`customer_number\` e o segundo é o \`installation_number\`.
`;
    const transcriptionResult = await transcribeImageWithLangChain();

    const response = await AI.invoke([
      { role: "system", content: systemMessage },
      { role: "user", content: transcriptionResult! },
    ]);

    // Use a nova função para limpar a string antes de analisar
    const cleanedJsonString = extractJsonFromString(response.text);

    // Agora o JSON.parse() vai funcionar de forma confiável
    const billData: EnergyBillData = JSON.parse(cleanedJsonString);

    displayResult("Gemini API - Text Generation", response.text);
    displayResult("Gemini API - Text Generation Parsed", billData);
  } catch (error) {
    console.error("Erro:", error instanceof Error ? error.message : error);
  }
}

main();
