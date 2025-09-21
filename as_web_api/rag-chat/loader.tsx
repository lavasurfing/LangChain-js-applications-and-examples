import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// Path to the PDF file
const path_to_pdf = path.resolve(__dirname, '../../pdf_book', 'thebook.pdf');

console.log(path_to_pdf);

const loader = async () => {
  const pdf_loader = new PDFLoader(path_to_pdf);
  const pdf_data = await pdf_loader.load();
  return pdf_data;
}

export default loader;


