import React from 'react';
import { Shield, Cpu, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigateTab: (tab: string) => void;
}

export default function About({ onNavigateTab }: AboutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About PDF Master Pro</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Redefining Document Processing for the Privacy Era
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          PDF Master Pro was engineered from the ground up to challenge the legacy paradigm of document
          utilities. For over a decade, working with PDF files on the web meant uploading sensitive financial
          records, contracts, medical forms, and IDs to opaque cloud servers.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Zero Server Uploads
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All 50 tools execute within the browser sandbox using JavaScript and WebAssembly primitives.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Browser Memory Safety
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Temporary memory buffers and object URLs are systematically garbage-collected upon download.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Full Tool Parity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From merging and rotating to client-side OCR and AcroForm creation, without subscription barriers.
          </p>
        </div>
      </div>

      {/* Technology Stack Details */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Under the Hood: Open Standards Stack
        </h3>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>pdf-lib:</strong> Document creation, modification, stream serialization, and AcroForm binding.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>PDF.js:</strong> Mozilla's standard PDF rendering pipeline for rasterizing pages to HTML5 canvases.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>Tesseract.js:</strong> Client-side neural optical character recognition in a Web Worker thread.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>JSZip:</strong> Client-side deflate and ZIP container assembly for batch page exports.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>SheetJS & Mammoth:</strong> Spreadsheet table construction and Word XML extraction.</span>
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigateTab('all-tools')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
        >
          <span>Explore All 50 Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
