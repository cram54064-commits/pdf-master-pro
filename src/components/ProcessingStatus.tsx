import React from 'react';
import { Loader2, XCircle } from 'lucide-react';

interface ProcessingStatusProps {
  step: string;
  percent: number;
  onCancel?: () => void;
}

export default function ProcessingStatus({ step, percent, onCancel }: ProcessingStatusProps) {
  return (
    <div className="w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
        Processing Your Document
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
        {step || 'Processing...'}
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50 mb-3">
        <div
          className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-300 shadow-xs"
          style={{ width: `${Math.max(5, Math.min(100, percent))}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-md text-xs font-semibold text-slate-400 mb-6">
        <span>Client-side engine</span>
        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
          {percent}%
        </span>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Operation</span>
        </button>
      )}
    </div>
  );
}
