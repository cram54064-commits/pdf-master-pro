import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, FilePlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { validateInputFile, MAX_BROWSER_FILE_SIZE } from '../utils/fileValidation';
import { formatFileSize } from '../utils/formatFileSize';
import { generateSamplePdf } from '../utils/samplePdf';

interface FileUploaderProps {
  acceptedTypes: 'pdf' | 'image' | 'word' | 'excel' | 'text' | 'any';
  acceptedExtensions: string;
  multiple?: boolean;
  maxFileSize?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  allowSample?: boolean;
}

export default function FileUploader({
  acceptedTypes = 'pdf',
  acceptedExtensions = '.pdf',
  multiple = false,
  maxFileSize = MAX_BROWSER_FILE_SIZE,
  onFilesSelected,
  title = 'Select or drop your files here',
  subtitle,
  allowSample = true,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileList = async (fileList: FileList | File[]) => {
    setValidationError(null);
    setValidationWarning(null);
    setIsValidating(true);

    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) {
      setIsValidating(false);
      return;
    }

    const selectedFiles = multiple ? filesArray : [filesArray[0]];
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      const result = await validateInputFile(file, acceptedTypes, maxFileSize);
      if (!result.valid) {
        setValidationError(result.error || `Invalid file "${file.name}"`);
        setIsValidating(false);
        return;
      }
      if (result.warning) {
        setValidationWarning(result.warning);
      }
      validFiles.push(file);
    }

    setIsValidating(false);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFileList(e.dataTransfer.files);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFileList(e.target.files);
    }
  };

  const handleLoadSample = async () => {
    try {
      setIsValidating(true);
      const sample = await generateSamplePdf();
      await processFileList([sample]);
    } catch (err: any) {
      setValidationError('Failed to generate sample PDF: ' + err.message);
      setIsValidating(false);
    }
  };

  return (
    <div className="w-full">
      {/* Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedExtensions}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          id="file-upload-input"
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Visual Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 ring-8 ring-indigo-500/5">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {title}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {subtitle || (
              <>
                Drag and drop your files, or click browse.{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {acceptedExtensions.toUpperCase()}
                </span>{' '}
                up to {formatFileSize(maxFileSize)}.
              </>
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isValidating}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Browse Files</span>
            </button>

            {allowSample && acceptedTypes === 'pdf' && (
              <button
                type="button"
                onClick={handleLoadSample}
                disabled={isValidating}
                className="px-4 py-3 rounded-xl font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5 cursor-pointer text-sm"
                title="Generates a complete 3-page test PDF in browser memory"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Use Sample PDF</span>
              </button>
            )}
          </div>

          {multiple && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              Multiple files supported • Reorder files after upload
            </p>
          )}
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-800 dark:text-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <div>
            <p className="font-semibold">Upload Rejected</p>
            <p className="text-xs mt-0.5 text-rose-700 dark:text-rose-300">{validationError}</p>
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {validationWarning && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-amber-800 dark:text-amber-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="text-xs">{validationWarning}</div>
        </div>
      )}
    </div>
  );
}
