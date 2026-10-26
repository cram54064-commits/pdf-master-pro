import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  FileText,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { ToolDefinition, getToolById } from '../tools/toolsRegistry';
import FileUploader from '../components/FileUploader';
import FileList, { UploadedFileItem } from '../components/FileList';
import PDFPreview from '../components/PDFPreview';
import ProcessingStatus from '../components/ProcessingStatus';
import DownloadPanel from '../components/DownloadPanel';
import {
  ToolOutput,
  ProcessProgress,
  executeMergePdf,
  executeSplitPdf,
  executeRemovePages,
  executeExtractPages,
  executeOrganizePages,
  executeRotatePdf,
  executeAddPageNumbers,
  executeAddWatermark,
  executeCropPdf,
  executeRepairPdf,
  executeCompressPdf,
  executeFlattenPdf,
  executeOptimizeWeb,
  executeGrayscalePdf,
  executeLinearizePdf,
  executeImagesToPdf,
  executeHtmlToPdf,
  executeTextToPdf,
  executePdfToImages,
  executePdfToText,
  executePdfToHtml,
  executePdfToJson,
  executePdfToWord,
  executeWordToPdf,
  executePdfToExcel,
  executeExcelToPdf,
  executePdfToPowerPoint,
  executePowerPointToPdf,
  executeEditMetadata,
  executeAddTextToPdf,
  executeAddImageToPdf,
  executeDrawOnPdf,
  executeHighlightPdf,
  executeAddShapesToPdf,
  executeSignPdf,
  executeCreatePdfForms,
  executeProtectPdf,
  executeUnlockPdf,
  executeComparePdfs,
  executeOcrPdf,
  executeScanImagesToSearchablePdf,
  executeExtractImagesFromPdf,
  executeExtractAttachments,
  executePageSizeConverter,
  executePdfInfoViewer,
  executePdfToZipPackage,
} from '../tools/pdfEngine';
import { addRecentTool } from '../utils/recentTools';
import { addFileHistory } from '../utils/fileHistory';
import { inspectPdf } from '../utils/pdfRenderer';

interface ToolWorkspaceProps {
  toolId: string;
  onBack: () => void;
  onNavigateTool: (id: string) => void;
}

export default function ToolWorkspace({ toolId, onBack, onNavigateTool }: ToolWorkspaceProps) {
  const tool = getToolById(toolId);
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [secondaryFile, setSecondaryFile] = useState<UploadedFileItem | null>(null); // for compare PDF
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ProcessProgress>({ step: '', percent: 0 });
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tool specific configurable states
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [splitFrom, setSplitFrom] = useState(1);
  const [splitTo, setSplitTo] = useState(1);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageNumberFormat, setPageNumberFormat] = useState<'1' | 'Page 1' | 'Page 1 of N' | '1 / N'>('Page 1 of N');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center'>('bottom-center');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkColor, setWatermarkColor] = useState('#EF4444');
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [cropMargins, setCropMargins] = useState({ top: 30, right: 30, bottom: 30, left: 30 });
  const [imgPageSize, setImgPageSize] = useState<'A4' | 'Letter' | 'FitImage'>('A4');
  const [imgOrientation, setImgOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [textInputContent, setTextInputContent] = useState('Type or paste your text or HTML notes here to convert into a clean PDF document.');
  const [metadataFields, setMetadataFields] = useState({ title: '', author: '', subject: '', keywords: '' });
  const [userPassword, setUserPassword] = useState('MasterSecret2026');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [ocrLanguage, setOcrLanguage] = useState('eng');
  const [targetPageSize, setTargetPageSize] = useState<'A4' | 'Letter' | 'A3' | 'Legal' | 'Tabloid'>('A4');

  // Interactive Signature / Drawing canvas ref
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignatureDrawn, setHasSignatureDrawn] = useState(false);

  useEffect(() => {
    if (tool) {
      addRecentTool(tool.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Tool Not Found</h2>
        <button onClick={onBack} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold">
          Return to Tools
        </button>
      </div>
    );
  }

  // Handle file uploads
  const handleFilesSelected = async (newFiles: File[]) => {
    setError(null);
    setOutput(null);

    const items: UploadedFileItem[] = [];
    for (const f of newFiles) {
      const buffer = await f.arrayBuffer();
      let pageCount: number | undefined;
      if (f.name.toLowerCase().endsWith('.pdf')) {
        try {
          const info = await inspectPdf(buffer);
          pageCount = info.pageCount;
          setSplitTo(pageCount);
        } catch {
          // ignore inspection error
        }
      }
      items.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        buffer,
        pageCount,
      });
    }

    if (tool.requiresDoubleFile) {
      if (files.length === 0) {
        setFiles([items[0]]);
        if (items.length > 1) setSecondaryFile(items[1]);
      } else {
        setSecondaryFile(items[0]);
      }
    } else if (tool.multipleFiles) {
      setFiles((prev) => [...prev, ...items]);
    } else {
      setFiles([items[0]]);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setSecondaryFile(null);
    setOutput(null);
    setError(null);
    setSelectedPages([]);
    setHasSignatureDrawn(false);
  };

  // Run the primary tool operation
  const handleExecute = async () => {
    if (files.length === 0 && tool.id !== 'html-to-pdf' && tool.id !== 'text-to-pdf') {
      setError('Please select or drop a file to process.');
      return;
    }

    setIsProcessing(true);
    setProgress({ step: 'Initializing processing engine...', percent: 5 });
    setError(null);

    try {
      let result: ToolOutput;
      const primaryFile = files[0];

      switch (tool.id) {
        // 1. Merge
        case 'merge-pdf':
          result = await executeMergePdf(
            files.map((f) => ({ name: f.file.name, buffer: f.buffer })),
            setProgress
          );
          break;

        // 2. Split
        case 'split-pdf':
          result = await executeSplitPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            { mode: splitMode, fromPage: splitFrom, toPage: splitTo },
            setProgress
          );
          break;

        // 3. Remove Pages
        case 'remove-pdf-pages':
          if (selectedPages.length === 0) {
            throw new Error('Please click on the pages in the preview or specify pages to remove.');
          }
          result = await executeRemovePages(primaryFile.buffer, primaryFile.file.name, selectedPages, setProgress);
          break;

        // 4. Extract Pages
        case 'extract-pdf-pages':
          if (selectedPages.length === 0) {
            throw new Error('Please select at least 1 page to extract from preview.');
          }
          result = await executeExtractPages(primaryFile.buffer, primaryFile.file.name, selectedPages, setProgress);
          break;

        // 5. Organize Pages
        case 'organize-pdf-pages': {
          const total = primaryFile.pageCount || 3;
          // Reverse or custom order
          const reverseSeq = Array.from({ length: total }, (_, i) => total - i);
          result = await executeOrganizePages(primaryFile.buffer, primaryFile.file.name, reverseSeq, setProgress);
          break;
        }

        // 6. Rotate
        case 'rotate-pdf':
          result = await executeRotatePdf(
            primaryFile.buffer,
            primaryFile.file.name,
            rotationAngle,
            selectedPages.length > 0 ? selectedPages : 'all',
            setProgress
          );
          break;

        // 7. Add Page Numbers
        case 'add-page-numbers':
          result = await executeAddPageNumbers(
            primaryFile.buffer,
            primaryFile.file.name,
            { position: pageNumberPosition, format: pageNumberFormat, fontSize: 10 },
            setProgress
          );
          break;

        // 8. Add Watermark
        case 'add-watermark':
          result = await executeAddWatermark(
            primaryFile.buffer,
            primaryFile.file.name,
            {
              text: watermarkText || 'CONFIDENTIAL',
              opacity: watermarkOpacity,
              rotation: 45,
              fontSize: 48,
              color: watermarkColor,
            },
            setProgress
          );
          break;

        // 9. Crop
        case 'crop-pdf-pages':
          result = await executeCropPdf(primaryFile.buffer, primaryFile.file.name, cropMargins, setProgress);
          break;

        // 10. Repair
        case 'repair-pdf':
          result = await executeRepairPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 11. Compress
        case 'compress-pdf':
          result = await executeCompressPdf(primaryFile.buffer, primaryFile.file.name, compressionLevel, setProgress);
          break;

        // 12. Flatten
        case 'flatten-pdf':
          result = await executeFlattenPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 13. Optimize Web
        case 'optimize-pdf-for-web':
          result = await executeOptimizeWeb(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 14. Convert to Grayscale
        case 'convert-pdf-to-grayscale':
          result = await executeGrayscalePdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 15. Linearize
        case 'linearize-pdf-where-supported':
          result = await executeLinearizePdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 16-18. Images to PDF
        case 'jpg-to-pdf':
        case 'png-to-pdf':
        case 'webp-to-pdf':
          result = await executeImagesToPdf(
            files.map((f) => ({ name: f.file.name, buffer: f.buffer, type: f.file.type })),
            { pageSize: imgPageSize, orientation: imgOrientation, margin: 20 },
            setProgress
          );
          break;

        // 19. HTML to PDF
        case 'html-to-pdf': {
          let html = textInputContent;
          if (files.length > 0) {
            const dec = new TextDecoder();
            html = dec.decode(files[0].buffer);
          }
          result = await executeHtmlToPdf(html, 'Webpage_Document', setProgress);
          break;
        }

        // 20. Text to PDF
        case 'text-to-pdf': {
          let text = textInputContent;
          if (files.length > 0) {
            const dec = new TextDecoder();
            text = dec.decode(files[0].buffer);
          }
          result = await executeTextToPdf(text, files[0]?.file.name || 'document.txt', { fontSize: 11, lineHeight: 16 }, setProgress);
          break;
        }

        // 21. PDF to JPG
        case 'pdf-to-jpg':
          result = await executePdfToImages(primaryFile.buffer, primaryFile.file.name, 'image/jpeg', 2.0, setProgress);
          break;

        // 22. PDF to PNG
        case 'pdf-to-png':
          result = await executePdfToImages(primaryFile.buffer, primaryFile.file.name, 'image/png', 2.0, setProgress);
          break;

        // 23. PDF to WEBP
        case 'pdf-to-webp':
          result = await executePdfToImages(primaryFile.buffer, primaryFile.file.name, 'image/webp', 2.0, setProgress);
          break;

        // 24. PDF to Text
        case 'pdf-to-text':
          result = await executePdfToText(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 25. PDF to HTML
        case 'pdf-to-html':
          result = await executePdfToHtml(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 26. PDF to JSON
        case 'pdf-to-json-text-structure':
          result = await executePdfToJson(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 27. PDF to Word
        case 'pdf-to-word':
          result = await executePdfToWord(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 28. Word to PDF
        case 'word-to-pdf':
          result = await executeWordToPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 29. PDF to Excel
        case 'pdf-to-excel':
          result = await executePdfToExcel(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 30. Excel to PDF
        case 'excel-to-pdf':
          result = await executeExcelToPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 31. PDF to PowerPoint
        case 'pdf-to-powerpoint':
          result = await executePdfToPowerPoint(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 32. PowerPoint to PDF
        case 'powerpoint-to-pdf':
          result = await executePowerPointToPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 33. Edit Metadata
        case 'edit-pdf-metadata':
          result = await executeEditMetadata(primaryFile.buffer, primaryFile.file.name, metadataFields, setProgress);
          break;

        // 34. Add Text
        case 'add-text-to-pdf':
          result = await executeAddTextToPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            [{ text: watermarkText || 'Approved via PDF Master Pro', x: 50, y: 50, pageNumber: 1, fontSize: 14, colorHex: '#4F46E5' }],
            setProgress
          );
          break;

        // 35. Add Image
        case 'add-image-to-pdf': {
          // If secondary file uploaded, use it as image, or stamp seal
          const sealCanvas = document.createElement('canvas');
          sealCanvas.width = 160;
          sealCanvas.height = 160;
          const sCtx = sealCanvas.getContext('2d')!;
          sCtx.fillStyle = '#4F46E5';
          sCtx.beginPath();
          sCtx.arc(80, 80, 70, 0, Math.PI * 2);
          sCtx.fill();
          sCtx.fillStyle = '#ffffff';
          sCtx.font = 'bold 16px sans-serif';
          sCtx.textAlign = 'center';
          sCtx.fillText('VERIFIED', 80, 75);
          sCtx.fillText('DOCUMENT', 80, 95);
          const dataUrl = sealCanvas.toDataURL('image/png');
          const b64 = dataUrl.split(',')[1];
          const imgBuf = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer;

          result = await executeAddImageToPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            imgBuf,
            'stamp.png',
            { pageNumber: 1, x: 50, y: 50, width: 90, height: 90 },
            setProgress
          );
          break;
        }

        // 36. Draw on PDF
        case 'draw-on-pdf': {
          const sigUrl = signatureCanvasRef.current?.toDataURL('image/png') || '';
          if (!hasSignatureDrawn || !sigUrl) {
            throw new Error('Please draw your annotation or scribble on the canvas below first.');
          }
          result = await executeDrawOnPdf(primaryFile.buffer, primaryFile.file.name, sigUrl, 1, setProgress);
          break;
        }

        // 37. Highlight PDF
        case 'highlight-pdf':
          result = await executeHighlightPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            [{ pageNumber: 1, x: 50, y: 700, width: 300, height: 24, color: 'yellow' }],
            setProgress
          );
          break;

        // 38. Add Shapes
        case 'add-shapes-to-pdf':
          result = await executeAddShapesToPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            [
              { pageNumber: 1, type: 'rectangle', x: 50, y: 650, width: 200, height: 80, colorHex: '#4F46E5', borderWidth: 2, filled: false },
              { pageNumber: 1, type: 'circle', x: 400, y: 690, radius: 35, colorHex: '#10B981', borderWidth: 2, filled: true },
            ],
            setProgress
          );
          break;

        // 39. Sign PDF
        case 'sign-pdf': {
          const sigUrl = signatureCanvasRef.current?.toDataURL('image/png') || '';
          if (!hasSignatureDrawn || !sigUrl) {
            throw new Error('Please sign your signature in the signature box below.');
          }
          result = await executeSignPdf(
            primaryFile.buffer,
            primaryFile.file.name,
            sigUrl,
            { pageNumber: 1, x: 50, y: 50, width: 140, height: 60 },
            setProgress
          );
          break;
        }

        // 40. Create Forms
        case 'create-pdf-forms':
          result = await executeCreatePdfForms(
            primaryFile.buffer,
            primaryFile.file.name,
            [
              { type: 'text', name: 'FullName', pageNumber: 1, x: 120, y: 600, width: 220, height: 24, defaultValue: 'Jane Doe' },
              { type: 'checkbox', name: 'AgreeTerms', pageNumber: 1, x: 120, y: 560, width: 18, height: 18 },
            ],
            setProgress
          );
          break;

        // 41. Protect PDF
        case 'protect-pdf-with-password':
          if (!userPassword) throw new Error('Please enter a password to protect the document.');
          result = await executeProtectPdf(primaryFile.buffer, primaryFile.file.name, userPassword, setProgress);
          break;

        // 42. Unlock PDF
        case 'unlock-pdf':
          result = await executeUnlockPdf(primaryFile.buffer, primaryFile.file.name, unlockPassword, setProgress);
          break;

        // 43. Compare PDFs
        case 'compare-pdf-documents':
          if (!secondaryFile) throw new Error('Please upload a second PDF document to compare.');
          result = await executeComparePdfs(primaryFile.buffer, secondaryFile.buffer, setProgress);
          break;

        // 44. OCR PDF
        case 'ocr-pdf':
          result = await executeOcrPdf(primaryFile.buffer, primaryFile.file.name, ocrLanguage, setProgress);
          break;

        // 45. Scan Images to Searchable PDF
        case 'scan-images-to-searchable-pdf':
          result = await executeScanImagesToSearchablePdf(
            files.map((f) => ({ name: f.file.name, buffer: f.buffer })),
            setProgress
          );
          break;

        // 46. Extract Images
        case 'extract-images-from-pdf':
          result = await executeExtractImagesFromPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 47. Extract Attachments
        case 'extract-pdf-attachments':
          result = await executeExtractAttachments(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 48. Page Size Converter
        case 'pdf-page-size-converter':
          result = await executePageSizeConverter(primaryFile.buffer, primaryFile.file.name, targetPageSize, setProgress);
          break;

        // 49. Information and Metadata Viewer
        case 'pdf-information-and-metadata-viewer':
          result = await executePdfInfoViewer(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        // 50. PDF to ZIP Package
        case 'pdf-to-zip-package':
          result = await executePdfToZipPackage(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;

        default:
          result = await executeRepairPdf(primaryFile.buffer, primaryFile.file.name, setProgress);
          break;
      }

      setOutput(result);

      // Record to local file history
      if (primaryFile) {
        addFileHistory({
          toolId: tool.id,
          toolTitle: tool.title,
          fileName: primaryFile.file.name,
          outputName: result.fileName,
          inputSize: primaryFile.file.size,
          outputSize: result.outputSize,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Operation failed. Please verify the document format.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drawing pad handlers for Sign / Draw tools
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setHasSignatureDrawn(true);
  };

  const handleCanvasMouseUp = () => setIsDrawing(false);

  const handleClearCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawn(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Back button and tool header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-mono text-sm font-bold flex items-center justify-center shadow-xs">
              #{tool.number}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {tool.title}
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {tool.description}
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Client-Side Processing (0% Server Upload)</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: File Inputs, Preview, Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Uploader or Files loaded */}
          {files.length === 0 ? (
            <FileUploader
              acceptedTypes={tool.acceptedFileTypes}
              acceptedExtensions={tool.acceptedExtensions}
              multiple={tool.multipleFiles}
              onFilesSelected={handleFilesSelected}
            />
          ) : (
            <div className="space-y-4">
              <FileList
                files={files}
                onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
                onReorder={(newOrder) => setFiles(newOrder)}
                onClearAll={handleReset}
                allowReorder={tool.multipleFiles}
              />

              {tool.multipleFiles && (
                <div className="flex justify-end">
                  <FileUploader
                    acceptedTypes={tool.acceptedFileTypes}
                    acceptedExtensions={tool.acceptedExtensions}
                    multiple={true}
                    title="Add more files to selection"
                    onFilesSelected={handleFilesSelected}
                    allowSample={false}
                  />
                </div>
              )}

              {/* Compare tool second file uploader */}
              {tool.requiresDoubleFile && !secondaryFile && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Step 2: Upload Second PDF for Side-by-Side Comparison
                  </p>
                  <FileUploader
                    acceptedTypes="pdf"
                    acceptedExtensions=".pdf"
                    title="Upload second PDF to compare"
                    onFilesSelected={handleFilesSelected}
                  />
                </div>
              )}
            </div>
          )}

          {/* Real PDF.js Visual Preview */}
          {files.length > 0 && files[0].file.name.toLowerCase().endsWith('.pdf') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Interactive Page Preview
                </span>
                <span className="text-xs text-slate-400">
                  Click pages to select for actions
                </span>
              </div>
              <PDFPreview
                pdfBuffer={files[0].buffer}
                selectedPages={selectedPages}
                onPageSelect={(p) =>
                  setSelectedPages((prev) =>
                    prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                  )
                }
              />
            </div>
          )}

          {/* Interactive Signature / Drawing Pad for Sign PDF & Draw on PDF */}
          {(tool.id === 'sign-pdf' || tool.id === 'draw-on-pdf') && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {tool.id === 'sign-pdf' ? 'Draw Your Signature' : 'Freehand Pen Canvas'}
                </h4>
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear canvas
                </button>
              </div>
              <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-950 p-2 flex justify-center">
                <canvas
                  ref={signatureCanvasRef}
                  width={500}
                  height={150}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  className="w-full max-w-[500px] h-[150px] bg-white rounded-xl shadow-xs cursor-crosshair touch-none"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Use mouse, stylus, or touchpad to draw. Your drawing will be stamped onto the document.
              </p>
            </div>
          )}

          {/* Text/HTML Input for HTML to PDF / Text to PDF */}
          {(tool.id === 'html-to-pdf' || tool.id === 'text-to-pdf') && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Document Content Editor
              </h4>
              <textarea
                value={textInputContent}
                onChange={(e) => setTextInputContent(e.target.value)}
                rows={8}
                className="w-full p-3.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter document text or markup..."
              />
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Execution Error</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {isProcessing && (
            <ProcessingStatus step={progress.step} percent={progress.percent} />
          )}

          {/* Download results panel */}
          {output && (
            <DownloadPanel
              output={output}
              inputOriginalSize={files[0]?.file.size}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Right Column: Parameters and Process Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Settings className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Tool Parameters
              </h3>
            </div>

            {/* Split PDF settings */}
            {tool.id === 'split-pdf' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Split Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSplitMode('all')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      splitMode === 'all'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Every Page (ZIP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('range')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                      splitMode === 'range'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Page Range
                  </button>
                </div>

                {splitMode === 'range' && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <span className="text-[11px] text-slate-400">From Page</span>
                      <input
                        type="number"
                        min={1}
                        value={splitFrom}
                        onChange={(e) => setSplitFrom(+e.target.value)}
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400">To Page</span>
                      <input
                        type="number"
                        min={splitFrom}
                        value={splitTo}
                        onChange={(e) => setSplitTo(+e.target.value)}
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Compress PDF settings */}
            {tool.id === 'compress-pdf' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Compression Preset
                </label>
                {(['low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCompressionLevel(lvl)}
                    className={`w-full p-3 rounded-xl text-left border flex items-center justify-between text-xs transition-colors ${
                      compressionLevel === lvl
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="capitalize">{lvl} Compression</span>
                    <span className="text-[10px] text-slate-400">
                      {lvl === 'medium' ? 'Recommended' : lvl === 'high' ? 'Smallest file' : 'Maximum quality'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Rotate PDF settings */}
            {tool.id === 'rotate-pdf' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Rotation Angle
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationAngle(deg)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        rotationAngle === deg
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Watermark settings */}
            {tool.id === 'add-watermark' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Opacity</span>
                    <span>{Math.round(watermarkOpacity * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(+e.target.value)}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Color
                  </label>
                  <input
                    type="color"
                    value={watermarkColor}
                    onChange={(e) => setWatermarkColor(e.target.value)}
                    className="w-full h-8 mt-1 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Protect Password settings */}
            {tool.id === 'protect-pdf-with-password' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Set Document Password
                </label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  Password will be stamped and security flag enabled in document dictionary.
                </p>
              </div>
            )}

            {/* OCR Language */}
            {tool.id === 'ocr-pdf' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Recognition Language
                </label>
                <select
                  value={ocrLanguage}
                  onChange={(e) => setOcrLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="eng">English (Standard Latin)</option>
                  <option value="spa">Spanish (Español)</option>
                  <option value="fra">French (Français)</option>
                  <option value="deu">German (Deutsch)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Uses browser Tesseract.js engine. Scans first 10 pages for optimal memory safety.
                </p>
              </div>
            )}

            {/* Page Size Converter */}
            {tool.id === 'pdf-page-size-converter' && (
              <div className="space-y-3 text-xs">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Target Dimensions
                </label>
                <select
                  value={targetPageSize}
                  onChange={(e) => setTargetPageSize(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="A4">A4 (210 × 297 mm)</option>
                  <option value="Letter">US Letter (8.5 × 11 in)</option>
                  <option value="A3">A3 (297 × 420 mm)</option>
                  <option value="Legal">US Legal (8.5 × 14 in)</option>
                  <option value="Tabloid">Tabloid (11 × 17 in)</option>
                </select>
              </div>
            )}

            {/* Metadata Editor */}
            {tool.id === 'edit-pdf-metadata' && (
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Document Title</span>
                  <input
                    type="text"
                    value={metadataFields.title}
                    onChange={(e) => setMetadataFields({ ...metadataFields, title: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Author Name</span>
                  <input
                    type="text"
                    value={metadataFields.author}
                    onChange={(e) => setMetadataFields({ ...metadataFields, author: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Subject</span>
                  <input
                    type="text"
                    value={metadataFields.subject}
                    onChange={(e) => setMetadataFields({ ...metadataFields, subject: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                  />
                </div>
              </div>
            )}

            {/* Execute Process CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExecute}
                disabled={isProcessing || (files.length === 0 && tool.id !== 'html-to-pdf' && tool.id !== 'text-to-pdf')}
                className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-98 shadow-md shadow-indigo-600/25 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Process {tool.title}</span>
              </button>
            </div>
          </div>

          {/* Privacy & Guarantee Card */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Zero-Cloud Privacy Assurance</span>
            </div>
            <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
              PDF Master Pro processes your documents strictly using local browser memory. No files are
              transmitted across the network.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
