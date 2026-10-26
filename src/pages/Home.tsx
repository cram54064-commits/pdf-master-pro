import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  CheckCircle2,
  HardDrive,
  Trash2,
  Sliders,
  Layers,
} from 'lucide-react';
import { ALL_TOOLS, CATEGORIES, ToolCategory, getToolById } from '../tools/toolsRegistry';
import ToolCard from '../components/ToolCard';
import FileUploader from '../components/FileUploader';
import { getRecentTools, getFavoriteTools } from '../utils/recentTools';
import { getFileHistory, clearFileHistory } from '../utils/fileHistory';
import { formatFileSize } from '../utils/formatFileSize';

interface HomeProps {
  onSelectTool: (toolId: string) => void;
  onNavigateTab: (tab: string, category?: string) => void;
}

export default function Home({ onSelectTool, onNavigateTab }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [history, setHistory] = useState(getFileHistory());

  const recentToolIds = getRecentTools().slice(0, 4);
  const recentTools = recentToolIds.map((id) => getToolById(id)).filter(Boolean);
  const favoriteIds = getFavoriteTools();

  // Filter tools for popular / category showcase
  const popularTools = ALL_TOOLS.filter((t) => t.isPopular).slice(0, 12);
  const displayTools =
    activeCategory === 'All'
      ? popularTools
      : ALL_TOOLS.filter((t) => t.category === activeCategory);

  const handleClearHistory = () => {
    clearFileHistory();
    setHistory([]);
  };

  // Quick file drop on hero
  const handleHeroFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const isImg = file.name.match(/\.(jpg|jpeg|png|webp)$/i);
      const isDocx = file.name.match(/\.docx$/i);
      const isXlsx = file.name.match(/\.(xlsx|xls|csv)$/i);

      if (isImg) onSelectTool('jpg-to-pdf');
      else if (isDocx) onSelectTool('word-to-pdf');
      else if (isXlsx) onSelectTool('excel-to-pdf');
      else onSelectTool('compress-pdf'); // default to compress or preview
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 text-center">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>50 Browser-Based PDF Tools • 100% Privacy-First</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
            Everything You Need to Work With{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
              PDFs
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Convert, compress, merge, split, edit, and manage your PDFs with powerful tools in one
            convenient workspace.
          </p>

          {/* Quick upload drop area on hero */}
          <div className="max-w-2xl mx-auto mb-8 shadow-xl rounded-3xl">
            <FileUploader
              acceptedTypes="any"
              acceptedExtensions=".pdf,.jpg,.jpeg,.png,.webp,.docx,.xlsx"
              multiple={true}
              title="Drop files here to start working immediately"
              subtitle="PDF, Office documents, or images up to 100 MB • Processed locally"
              onFilesSelected={handleHeroFilesSelected}
            />
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigateTab('all-tools')}
              className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Browse All 50 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTool('merge-pdf')}
              className="px-5 py-3 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              Merge PDFs
            </button>
            <button
              onClick={() => onSelectTool('compress-pdf')}
              className="px-5 py-3 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              Compress PDF
            </button>
          </div>
        </div>
      </section>

      {/* Recently Used Tools Strip */}
      {recentTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recently Used Tools
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('all-tools')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View directory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool!.id}
                tool={tool!}
                isFavorite={favoriteIds.includes(tool!.id)}
                onSelect={onSelectTool}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools Directory & Category Switcher */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Popular PDF Tools
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select any specialized tool to start organizing, converting, or editing.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Popular (12)
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={favoriteIds.includes(tool.id)}
              onSelect={onSelectTool}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigateTab('all-tools')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors shadow-xs"
          >
            <span>Explore All 50 Tools in Directory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Local Processing History Section */}
      {history.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Local Processing History (Stored in your browser only)
                </h3>
              </div>
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-52 overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mr-2">
                      {item.toolTitle}
                    </span>
                    <span className="text-slate-400">{item.fileName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>{formatFileSize(item.outputSize)}</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Privacy and Security Assurance Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Client-Side Security</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
              Your Files Stay on Your Device. Always.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Unlike cloud services that require uploading your private documents to third-party servers,
              PDF Master Pro runs entirely inside your browser sandbox. The PDF manipulation, image
              rasterization, OCR text recognition, and file merging take place locally using
              high-performance JavaScript and WebAssembly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero server document transmission</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant memory cleanup on download</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict 100 MB browser safety boundary</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
