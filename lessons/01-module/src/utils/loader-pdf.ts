import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as path from "path";

const filePath = path.join(process.cwd(), "src/files", "enel-boleto.pdf");

export async function LoaderPDF() {
  const loader = new PDFLoader(filePath, {
    splitPages: false,
    parsedItemSeparator: "",
  });
  const docs = await loader.load();
  console.log(
    `Loaded PDF content: ${docs[0].pageContent.replace(/[\r\n]+/g, " ")}`
  );
  return docs[0].pageContent;
}
