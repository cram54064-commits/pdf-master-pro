import React from 'react';
import { Check, Shield, Server, Zap, Cpu, Sparkles } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-200">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent & Open Access</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simple, Honest Pricing
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 mt-2">
          PDF Master Pro runs entirely inside your browser. No subscription traps, no watermarks, and no
          document storage fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Browser Free */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-xl relative flex flex-col justify-between">
          <div className="absolute -top-3.5 left-8 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Current Active Edition
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Browser Community Edition
              </h3>
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-400 font-medium">/ forever free</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Full access to all 50 PDF tools executing locally in your web browser with 100% data privacy.
            </p>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>All 50 tools included with unlimited usage</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero server document uploads (100% private)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Safe browser file handling up to 100 MB</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Client-side OCR text recognition (Tesseract.js)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No registration or account required</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            ✓ Available Right Now in Your Browser
          </div>
        </div>

        {/* Tier 2: Enterprise Backend Architecture */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Self-Hosted Enterprise Node
              </h3>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <Server className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">Custom / Open</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              For enterprise workloads requiring bulk gigabyte-scale processing, batch queues, and background
              Node.js daemon processing.
            </p>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Docker & Node.js backend runner</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Background job queues for files &gt; 500 MB</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Ephemeral scratch disk with auto-deletion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Configurable rate limits & security sandboxing</span>
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
            Architecture Blueprint Provided
          </div>
        </div>
      </div>

      {/* Backend Architecture Blueprint Details */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Large PDF & Enterprise Backend Architecture Guide
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          While the client-side edition operates comfortably up to 100 MB per file, files above several hundred
          megabytes require asynchronous background workers to prevent web browser tab crashes. Our recommended
          enterprise deployment utilizes Node.js worker pools with temporary RAM-disks, strict processing timeouts (e.g. 120s),
          and immediate cryptographically-secure file deletion.
        </p>
      </div>
    </div>
  );
}
