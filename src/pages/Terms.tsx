import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-800">
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Acceptable Usage
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p className="text-xs">
            By accessing and utilizing PDF Master Pro, you acknowledge and agree to these Terms of Service. If you
            do not agree with any portion of these terms, you should cease usage immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Permitted Use & Document Ownership
          </h2>
          <p className="text-xs">
            You retain 100% intellectual property ownership, copyright, and title to any documents, images, or
            spreadsheets you process through PDF Master Pro. You agree to use the software solely for documents you
            are authorized to inspect, modify, merge, or sign.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranty & Format Limitations
          </h2>
          <p className="text-xs">
            PDF Master Pro provides document manipulation software "as is" without warranties of any kind. While
            we strive for maximum fidelity:
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1 text-slate-500 dark:text-slate-400">
            <li>Corrupted or malformed PDFs may not be completely recoverable.</li>
            <li>Complex vector diagrams or proprietary fonts in PDF-to-Word conversions may require minor manual touch-ups.</li>
            <li>Optical character recognition (OCR) accuracy depends directly on the resolution and clarity of the input scan.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Limitation of Liability
          </h2>
          <p className="text-xs">
            In no event shall PDF Master Pro or its contributors be liable for any direct, indirect, incidental, or
            consequential damages arising from data corruption or browser memory limits. Always maintain an
            independent backup of your critical master documents.
          </p>
        </section>
      </div>
    </div>
  );
}
