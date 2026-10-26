import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates an in-memory sample 3-page PDF with realistic business report contents
 */
export async function generateSamplePdf(title: string = 'PDF Master Pro Sample Document'): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Title and Overview
  const page1 = pdfDoc.addPage([595.28, 841.89]);
  page1.drawRectangle({
    x: 0,
    y: 760,
    width: 595.28,
    height: 81.89,
    color: rgb(0.31, 0.27, 0.9), // Indigo 600
  });

  page1.drawText('PDF MASTER PRO — TEST DOCUMENT', {
    x: 50,
    y: 800,
    size: 20,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Confidential Business Architecture Report & Data Specification', {
    x: 50,
    y: 775,
    size: 11,
    font,
    color: rgb(0.85, 0.88, 1),
  });

  page1.drawText('1. Executive Overview', {
    x: 50,
    y: 700,
    size: 16,
    font: boldFont,
    color: rgb(0.12, 0.16, 0.24),
  });

  const p1Text = [
    'This test document was generated dynamically to verify client-side PDF capabilities',
    'including page extraction, reordering, compression, watermarking, and raster conversion.',
    '',
    'All processing is performed directly inside your modern web browser using WebAssembly',
    'and JavaScript primitives. No file contents are sent to external cloud servers,',
    'ensuring 100% data privacy and compliance with enterprise security protocols.',
  ];

  let y = 670;
  p1Text.forEach((line) => {
    page1.drawText(line, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.25, 0.3, 0.4),
    });
    y -= 18;
  });

  // Table mockup on Page 1
  page1.drawRectangle({
    x: 50,
    y: 430,
    width: 495,
    height: 100,
    borderColor: rgb(0.8, 0.85, 0.9),
    borderWidth: 1,
    color: rgb(0.97, 0.98, 1),
  });

  page1.drawText('Sample Financial Performance Metrics (Q1 - Q4)', {
    x: 65,
    y: 505,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.25, 0.4),
  });

  page1.drawText('Metric                  Q1          Q2          Q3          Q4', {
    x: 65,
    y: 480,
    size: 10,
    font: boldFont,
    color: rgb(0.3, 0.35, 0.5),
  });

  page1.drawText('Revenue ($M)          14.2        18.6        22.4        29.1', {
    x: 65,
    y: 460,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page1.drawText('Gross Margin (%)       74%         78%         81%         84%', {
    x: 65,
    y: 442,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  page1.drawText('Page 1 of 3 — Generated for Testing', {
    x: 220,
    y: 30,
    size: 9,
    font,
    color: rgb(0.6, 0.65, 0.7),
  });

  // Page 2: Analysis & Diagrams
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  page2.drawText('2. Technical Capabilities & Security Protocol', {
    x: 50,
    y: 780,
    size: 16,
    font: boldFont,
    color: rgb(0.12, 0.16, 0.24),
  });

  const p2Text = [
    '• Client-side PDF-lib serialization engine with stream optimization',
    '• PDF.js rendering pipeline for real-time visual page inspection',
    '• Local AES document protection and security dictionary flags',
    '• Tesseract.js client-side OCR for scanned receipts and records',
    '• SheetJS table parsing and OpenXML DOCX text conversion',
  ];

  y = 740;
  p2Text.forEach((line) => {
    page2.drawText(line, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.2, 0.25, 0.35),
    });
    y -= 24;
  });

  // Graphic boxes
  page2.drawCircle({
    x: 150,
    y: 500,
    size: 40,
    borderColor: rgb(0.31, 0.27, 0.9),
    borderWidth: 2,
    color: rgb(0.9, 0.92, 1),
  });

  page2.drawRectangle({
    x: 280,
    y: 460,
    width: 90,
    height: 80,
    borderColor: rgb(0.1, 0.6, 0.4),
    borderWidth: 2,
    color: rgb(0.9, 0.98, 0.93),
  });

  page2.drawText('Page 2 of 3 — Generated for Testing', {
    x: 220,
    y: 30,
    size: 9,
    font,
    color: rgb(0.6, 0.65, 0.7),
  });

  // Page 3: Summary and Authorization
  const page3 = pdfDoc.addPage([595.28, 841.89]);
  page3.drawText('3. Authorization & Signature Section', {
    x: 50,
    y: 780,
    size: 16,
    font: boldFont,
    color: rgb(0.12, 0.16, 0.24),
  });

  page3.drawText('Signatures below confirm verification of document processing:', {
    x: 50,
    y: 740,
    size: 11,
    font,
    color: rgb(0.3, 0.35, 0.45),
  });

  page3.drawLine({
    start: { x: 50, y: 620 },
    end: { x: 260, y: 620 },
    thickness: 1,
    color: rgb(0.4, 0.4, 0.4),
  });

  page3.drawText('Authorized Signatory: Dr. Alex Vance', {
    x: 50,
    y: 600,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page3.drawLine({
    start: { x: 320, y: 620 },
    end: { x: 530, y: 620 },
    thickness: 1,
    color: rgb(0.4, 0.4, 0.4),
  });

  page3.drawText('Date of Verification: October 2026', {
    x: 320,
    y: 600,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page3.drawText('Page 3 of 3 — Generated for Testing', {
    x: 220,
    y: 30,
    size: 9,
    font,
    color: rgb(0.6, 0.65, 0.7),
  });

  const bytes = await pdfDoc.save();
  return new File([bytes as unknown as BlobPart], 'sample_document.pdf', { type: 'application/pdf' });
}
