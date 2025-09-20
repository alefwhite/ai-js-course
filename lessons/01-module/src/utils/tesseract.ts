import { createWorker } from "tesseract.js";
import * as path from "path";

const filePath = path.join(process.cwd(), "src/files", "Screenshot_2.png");

export async function recognizeTextFromImage() {
  const worker = await createWorker("por");
  const ret = await worker.recognize(filePath);
  console.log("Extract Text: ", ret.data.text);
  await worker.terminate();
}
