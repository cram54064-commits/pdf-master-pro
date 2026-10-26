import React, { useEffect, useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash2,
  Check,
  Eye,
  Loader2,
} from 'lucide-react';
import { loadPdfDocument, renderPageToCanvas } from '../utils/pdfRenderer';

interface PDFPreviewProps {
  pdfBuffer: ArrayBuffer;
  onPageSelect?: (pageNumber: number) => void;
  selectedPages?: number[];
  allowPageActions?: boolean;
  onRotatePage?: (pageNumber: number) => void;
  onDeletePage?: (pageNumber: number) => void;
  initialPage?: number;
}

export default function PDFPreview({
  pdfBuffer,
  onPageSelect,
  selectedPages = [],
  allowPageActions = false,
  onRotatePage,
  onDeletePage,
  initialPage = 1,
}: PDFPreviewProps) {
  const [docProxy, setDocProxy] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [thumbnails, setThumbnails] = useState<{ page: number; dataUrl: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const currentCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load document proxy
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    loadPdfDocument(pdfBuffer)
      .then((doc) => {
        if (!isMounted) return;
        setDocProxy(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setIsLoading(false);

        // Load thumbnail strip (first 10 pages on demand)
        const loadThumbs = async () => {
          const list: { page: number; dataUrl: string }[] = [];
          const count = Math.min(doc.numPages, 16);
          for (let p = 1; p <= count; p++) {
            try {
              const canvas = await renderPageToCanvas(doc, p, 0.25);
              list.push({ page: p, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
            } catch {
              // ignore thumbnail error
            }
          }
          if (isMounted) setThumbnails(list);
        };
        loadThumbs();
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to render PDF preview: ' + (err.message || err));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pdfBuffer]);

  // Render current main page
  useEffect(() => {
    if (!docProxy || totalPages === 0) return;

    let isMounted = true;
    const rotation = pageRotations[currentPage] || 0;

    renderPageToCanvas(docProxy, currentPage, scale, rotation)
      .then((canvas) => {
        if (!isMounted || !canvasContainerRef.current) return;
        canvasContainerRef.current.innerHTML = '';
        canvas.className = 'rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 max-w-full h-auto bg-white transition-all';
        canvasContainerRef.current.appendChild(canvas);
        currentCanvasRef.current = canvas;
      })
      .catch((err) => {
        console.error('Error rendering page:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [docProxy, currentPage, scale, pageRotations]);

  const handleZoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.25).toFixed(2)));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));
  const handleFitWidth = () => setScale(1.0);

  const handleRotateCurrent = () => {
    const nextRotation = ((pageRotations[currentPage] || 0) + 90) % 360;
    setPageRotations((prev) => ({ ...prev, [currentPage]: nextRotation }));
    onRotatePage?.(currentPage);
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Rendering PDF Preview...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm">
        <p className="font-semibold">Preview Notice</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/95 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 gap-2 text-xs">
        {/* Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-300 font-medium px-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Fit controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-1 hover:text-indigo-400 disabled:opacity-40"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1 text-slate-300 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            className="p-1 hover:text-indigo-400 disabled:opacity-40"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFitWidth}
            className="p-1 hover:text-indigo-400 ml-1 border-l border-slate-700 pl-1.5"
            title="Fit to width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Page Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRotateCurrent}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Rotate preview 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rotate</span>
          </button>

          {allowPageActions && onDeletePage && (
            <button
              onClick={() => onDeletePage(currentPage)}
              disabled={totalPages <= 1}
              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors disabled:opacity-40"
              title="Delete page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onPageSelect && (
            <button
              onClick={() => onPageSelect(currentPage)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedPages.includes(currentPage)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{selectedPages.includes(currentPage) ? 'Selected' : 'Select'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Page Canvas Display */}
      <div className="flex-1 min-h-[380px] max-h-[560px] overflow-auto p-6 bg-slate-950 flex items-center justify-center">
        <div ref={canvasContainerRef} className="flex justify-center" />
      </div>

      {/* Bottom Thumbnail Strip */}
      {thumbnails.length > 1 && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 overflow-x-auto flex items-center gap-3 no-scrollbar">
          {thumbnails.map((thumb) => {
            const isSelected = selectedPages.includes(thumb.page);
            const isCurrent = currentPage === thumb.page;
            return (
              <button
                key={thumb.page}
                onClick={() => {
                  setCurrentPage(thumb.page);
                  onPageSelect?.(thumb.page);
                }}
                className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all p-0.5 text-left group ${
                  isCurrent
                    ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                    : isSelected
                    ? 'border-emerald-500'
                    : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb.dataUrl}
                  alt={`Page ${thumb.page}`}
                  className="w-16 h-22 object-cover rounded bg-white"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-[9px] font-mono text-white rounded">
                  {thumb.page}
                </span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
