import React from 'react';
import { Shield, Lock, EyeOff, Database, CheckCircle2 } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-800">
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Privacy is Built Into the Architecture
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-mono">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Zero Document Transmission
          </h2>
          <p className="text-xs">
            PDF Master Pro is designed as a client-side web application. When you select or drop a PDF, image,
            spreadsheet, or text document into any of our 50 tools, your files are read into your local browser's
            virtual memory (RAM) via standard HTML5 File and FileReader APIs.
          </p>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            At no point are your document contents, file names, or metadata sent to or stored on remote cloud
            servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600" />
            2. Memory Cleanup & Garbage Collection
          </h2>
          <p className="text-xs">
            Once a tool finishes processing and you trigger a download, temporary browser object URLs
            (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">blob:...</code>) are
            automatically revoked via <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">URL.revokeObjectURL()</code>.
            Closing or refreshing the browser tab destroys all ephemeral in-memory buffers immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            3. Local Storage Policy
          </h2>
          <p className="text-xs">
            PDF Master Pro uses your browser's <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">localStorage</code> solely to remember:
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1 text-slate-500 dark:text-slate-400">
            <li>Your theme preference (light or dark mode)</li>
            <li>Your list of recently accessed and favorited tool shortcuts</li>
            <li>Local processing history metadata (file name and timestamp only; never the file binary data)</li>
          </ul>
          <p className="text-xs">
            You can clear your local processing history at any time using the "Clear History" button on the Home
            dashboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            4. No Advertising Trackers
          </h2>
          <p className="text-xs">
            We do not sell user data, do not use invasive third-party cross-site behavioral tracking cookies, and do
            not build advertising profiles.
          </p>
        </section>
      </div>
    </div>
  );
}
