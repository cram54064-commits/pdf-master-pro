import React, { useState } from 'react';
import {
  Download,
  Archive,
  CheckCircle2,
  RotateCcw,
  Copy,
  Check,
  FileText,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { ToolOutput } from '../tools/pdfEngine';
import { downloadFile, downloadZip } from '../utils/downloadFile';
import { formatFileSize } from '../utils/formatFileSize';

interface DownloadPanelProps {
  output: ToolOutput;
  inputOriginalSize?: number;
  onReset: () => void;
}

export default function DownloadPanel({ output, inputOriginalSize, onReset }: DownloadPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadSingle = () => {
    downloadFile(output.data, output.fileName, output.mimeType);
  };

  const handleDownloadZip = async () => {
    if (!output.files || output.files.length === 0) return;
    setIsZipping(true);
    try {
      await downloadZip(output.files, output.fileName.endsWith('.zip') ? output.fileName : `${output.fileName}.zip`);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyText = () => {
    if (!output.textPreview) return;
    navigator.clipboard.writeText(output.textPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasReduction =
    inputOriginalSize &&
    output.outputSize < inputOriginalSize &&
    output.outputSize > 0;

  const reductionPercentage = hasReduction
    ? Math.round(((inputOriginalSize - output.outputSize) / inputOriginalSize) * 100)
    : 0;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Processing Completed!
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Your document was processed safely in your browser.
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Process Another</span>
        </button>
      </div>

      {/* Output File Details Card */}
      <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
              {output.fileName}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{formatFileSize(output.outputSize)}</span>
              {hasReduction && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center">
                    <ArrowDownRight className="w-3 h-3" />
                    -{reductionPercentage}% smaller
                  </span>
                </>
              )}
              {output.files && (
                <>
                  <span>•</span>
                  <span>{output.files.length} output files</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {output.files && output.files.length > 1 ? (
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Archive className="w-4 h-4" />
              <span>{isZipping ? 'Creating ZIP...' : 'Download as ZIP'}</span>
            </button>
          ) : (
            <button
              onClick={handleDownloadSingle}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          )}
        </div>
      </div>

      {/* Multiple Files Preview List if applicable */}
      {output.files && output.files.length > 1 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Output File Package ({output.files.length} files)
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-slate-100/60 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800">
            {output.files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 text-xs border border-slate-200/50 dark:border-slate-800/60"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate mr-2">
                  {file.name}
                </span>
                <button
                  onClick={() => downloadFile(file.data, file.name)}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 cursor-pointer"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Text Preview Box if applicable */}
      {output.textPreview && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Content Preview
            </span>
            <button
              onClick={handleCopyText}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono max-h-56 overflow-y-auto whitespace-pre-wrap select-all border border-slate-800">
            {output.textPreview}
          </pre>
        </div>
      )}
    </div>
  );
}
