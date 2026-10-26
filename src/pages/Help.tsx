import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Cpu, HardDrive, Key, Sparkles } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does client-side PDF processing work without uploading files?',
      a: 'Modern web browsers support WebAssembly and JavaScript ArrayBuffers. PDF Master Pro loads your document binary data directly into local browser RAM and performs serialization, page extraction, rasterization, and compression on your computer’s processor. Your files never travel across the internet.',
    },
    {
      q: 'What is the maximum supported PDF file size in the browser?',
      a: 'We set a conservative safety limit of 100 MB per file. For files between 35 MB and 100 MB, you may see a warning indicating that memory-intensive tasks (like full-page 300 DPI rasterization) may take several seconds. For gigabyte-scale documents, a background Node.js server engine is recommended.',
    },
    {
      q: 'Can damaged or corrupted PDF files be repaired?',
      a: 'Tool #10 (Repair PDF) attempts to rebuild damaged cross-reference tables (xref), repair broken trailers, and re-serialize stream dictionaries. While this fixes many common corruption patterns, severely truncated or encrypted-corrupted documents with missing streams may be partially unrecoverable.',
    },
    {
      q: 'How does PDF to Word conversion handle formatting?',
      a: 'Our converter extracts structured textual content, headings, and paragraph blocks from PDF streams and wraps them in a standards-compliant OpenXML (.docx) container using JSZip. This preserves your document text, headings, and page boundaries so you can edit it directly in Microsoft Word or Google Docs.',
    },
    {
      q: 'Is Tesseract OCR performed on my device or via a remote API?',
      a: 'It is 100% on your device. The Tesseract.js engine downloads an open-source WebAssembly neural weight model once and runs OCR inside a background Web Worker thread, keeping your scanned documents confidential.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-800">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Help Center & Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions & Guidelines
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Find answers regarding browser performance, file size optimization, and tool capabilities.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Large PDF Performance Tips
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When processing documents over 50 pages, close unnecessary browser tabs to free available RAM.
            Use on-demand page preview instead of rendering all pages at once.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Keyboard Shortcuts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border">⌘K</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border">Ctrl+K</kbd> to open tool search anywhere.
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border">Esc</kbd> to dismiss dialogs.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Common Questions
        </h2>
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
