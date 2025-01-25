import * as PDFJS from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

// https://stackoverflow.com/questions/40635979/how-to-correctly-extract-text-from-a-pdf-using-pdf-js

PDFJS.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const getPageText = async (pdf: PDFJS.PDFDocumentProxy, pageNo: number) => {
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  const pageText = tokenizedText.items
    .map((token) => {
      const { str, hasEOL } = token as TextItem;
      return str + (hasEOL ? "\n" : " ");
    })
    .join("");
  return pageText;
};

export const getPDFText = async (source: File): Promise<string[]> => {
  const buffer = await source.arrayBuffer();
  const pdf = await PDFJS.getDocument(buffer).promise;
  const maxPages = pdf.numPages;
  const pageTextPromises = [];
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    pageTextPromises.push(getPageText(pdf, pageNo));
  }
  const pageTexts = await Promise.all(pageTextPromises);
  return pageTexts.map((content) => content.replace(/●/g, "•"));
};
