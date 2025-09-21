import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { DuplicateLink } from '../types';

// Set up the worker for pdf.js. This is required for it to work in a web environment.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.179/build/pdf.worker.min.mjs`;

const URL_REGEX = /(https?:\/\/[^\s/$.?#].[^\s]*)/gi;

/**
 * Extracts hyperlinks from a plain text file.
 * @param file The text file to analyze.
 * @returns A promise that resolves to an array of found URLs.
 */
async function extractLinksFromTxt(file: File): Promise<string[]> {
  const text = await file.text();
  return text.match(URL_REGEX) || [];
}

/**
 * Extracts hyperlinks from a PDF file using pdf.js.
 * It processes both the text content and link annotations.
 * @param file The PDF file to analyze.
 * @returns A promise that resolves to an array of found URLs.
 */
async function extractLinksFromPdf(file: File): Promise<string[]> {
  const links = new Set<string>();
  const arrayBuffer = await file.arrayBuffer();
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    
    // Extract from text content
    const textContent = await page.getTextContent();
    textContent.items.forEach(item => {
      if ('str' in item) {
        const textLinks = item.str.match(URL_REGEX);
        if (textLinks) {
          textLinks.forEach(link => links.add(link));
        }
      }
    });

    // Extract from link annotations
    const annotations = await page.getAnnotations();
    annotations
      .filter(ann => ann.subtype === 'Link' && ann.url)
      .forEach(ann => {
        if (ann.url) {
            links.add(ann.url);
        }
      });
  }
  
  return Array.from(links);
}

/**
 * Extracts hyperlinks from a DOCX file using mammoth.js.
 * It converts the document to raw text and then finds URLs.
 * @param file The DOCX file to analyze.
 * @returns A promise that resolves to an array of found URLs.
 */
async function extractLinksFromDocx(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  return text.match(URL_REGEX) || [];
}


/**
 * Analyzes a list of files, extracts hyperlinks, and identifies duplicates.
 * A link is considered a duplicate if it appears in more than one file.
 * @param files An array of File objects to analyze.
 * @returns A promise that resolves to an array of DuplicateLink objects.
 */
export async function analyzeFiles(files: File[]): Promise<DuplicateLink[]> {
  const fileAnalysisPromises = files.map(async file => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let links: string[] = [];
    
    try {
      switch (extension) {
        case 'txt':
          links = await extractLinksFromTxt(file);
          break;
        case 'pdf':
          links = await extractLinksFromPdf(file);
          break;
        case 'docx':
          links = await extractLinksFromDocx(file);
          break;
        default:
          console.warn(`Unsupported file type: ${file.name}`);
          // Silently ignore unsupported files, or you could throw an error.
          break;
      }
    } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        throw new Error(`Could not process file: ${file.name}. It might be corrupted or in an unsupported format.`);
    }

    return {
      fileName: file.name,
      links,
    };
  });

  const allFileData = await Promise.all(fileAnalysisPromises);

  const linkStats = new Map<string, { totalCount: number, files: Set<string> }>();

  allFileData.forEach(({ fileName, links }) => {
    links.forEach(link => {
      if (!linkStats.has(link)) {
        linkStats.set(link, { totalCount: 0, files: new Set() });
      }
      const stats = linkStats.get(link)!;
      stats.totalCount++;
      stats.files.add(fileName);
    });
  });

  const duplicates: DuplicateLink[] = [];
  linkStats.forEach((stats, link) => {
    // A link is a duplicate if it appears in more than one file.
    if (stats.files.size > 1) {
      duplicates.push({
        link,
        count: stats.totalCount,
        sourceFiles: Array.from(stats.files),
      });
    }
  });

  // Sort results by total count, descending.
  duplicates.sort((a, b) => b.count - a.count);

  return duplicates;
}