import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker using unpkg or cdnjs compatible worker URL matching pdfjs version
// This avoids bundling issues with Vite in browser environments
if (typeof window !== 'undefined') {
  // Use cdnjs or unpkg worker matching the loaded library version
  const pdfjsVersion = pdfjsLib.version || '4.10.38';
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;
}

export interface RenderedPage {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl: string;
  canvas?: HTMLCanvasElement;
}

export interface PDFInfo {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modDate?: string;
  pageSize?: { width: number; height: number };
  isEncrypted?: boolean;
  version?: string;
}

/**
 * Loads a PDF document from an ArrayBuffer or File
 */
export async function loadPdfDocument(data: ArrayBuffer | Uint8Array, password?: string): Promise<pdfjsLib.PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument({
    data: data instanceof Uint8Array ? data : new Uint8Array(data),
    password: password || undefined,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

/**
 * Extracts basic metadata & page info
 */
export async function inspectPdf(data: ArrayBuffer | Uint8Array): Promise<PDFInfo> {
  const doc = await loadPdfDocument(data);
  const metadata = await doc.getMetadata().catch(() => null);
  const firstPage = await doc.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1.0 });

  const info = (metadata?.info as Record<string, any>) || {};

  return {
    pageCount: doc.numPages,
    title: info.Title || '',
    author: info.Author || '',
    subject: info.Subject || '',
    creator: info.Creator || '',
    producer: info.Producer || '',
    creationDate: info.CreationDate ? String(info.CreationDate) : undefined,
    modDate: info.ModDate ? String(info.ModDate) : undefined,
    pageSize: {
      width: Math.round(viewport.width),
      height: Math.round(viewport.height),
    },
    version: info.PDFFormatVersion || '1.7',
  };
}

/**
 * Renders a specific page to an offscreen HTMLCanvasElement
 */
export async function renderPageToCanvas(
  doc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.0,
  rotationOffset: number = 0
): Promise<HTMLCanvasElement> {
  const page = await doc.getPage(pageNumber);
  const currentRotation = (page.rotate + rotationOffset) % 360;
  const viewport = page.getViewport({ scale, rotation: currentRotation });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D canvas context');

  // Fill white background before rendering
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, viewport.width, viewport.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
    canvas: canvas,
  };

  await page.render(renderContext).promise;
  return canvas;
}

/**
 * Renders a page directly to image DataURL (JPEG/PNG)
 */
export async function renderPageToDataUrl(
  doc: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.0,
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality: number = 0.92,
  rotationOffset: number = 0
): Promise<string> {
  const canvas = await renderPageToCanvas(doc, pageNumber, scale, rotationOffset);
  return canvas.toDataURL(format, quality);
}

/**
 * Extracts raw plain text from all pages
 */
export async function extractTextFromPdf(
  data: ArrayBuffer | Uint8Array,
  onProgress?: (current: number, total: number) => void
): Promise<{ fullText: string; pageTexts: { page: number; text: string }[] }> {
  const doc = await loadPdfDocument(data);
  const pageTexts: { page: number; text: string }[] = [];
  let fullText = '';

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const pageStr = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ');
    
    pageTexts.push({ page: i, text: pageStr });
    fullText += `--- Page ${i} ---\n` + pageStr + '\n\n';
    if (onProgress) onProgress(i, doc.numPages);
  }

  return { fullText, pageTexts };
}

/**
 * Extracts structured text items with bounding boxes and font names
 */
export async function extractStructuredJsonFromPdf(
  data: ArrayBuffer | Uint8Array
): Promise<any> {
  const doc = await loadPdfDocument(data);
  const result: any[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent();

    const items = textContent.items.map((item: any) => ({
      str: item.str,
      dir: item.dir,
      width: item.width,
      height: item.height,
      transform: item.transform,
      fontName: item.fontName,
      x: item.transform ? Math.round(item.transform[4]) : 0,
      y: item.transform ? Math.round(viewport.height - item.transform[5]) : 0,
    }));

    result.push({
      page: i,
      dimensions: { width: Math.round(viewport.width), height: Math.round(viewport.height) },
      itemsCount: items.length,
      items,
    });
  }

  return {
    totalPages: doc.numPages,
    pages: result,
  };
}
