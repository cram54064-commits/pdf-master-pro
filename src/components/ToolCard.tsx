import React from 'react';
import {
  Combine,
  Split,
  Trash2,
  FileCheck2,
  LayoutGrid,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  Wrench,
  FileArchive,
  Layers2,
  Globe,
  Contrast,
  FastForward,
  Image,
  ImageIcon,
  FileImage,
  Code,
  FileText,
  ImageDown,
  FileSpreadsheet,
  FilePieChart,
  AlignLeft,
  FileCode2,
  Binary,
  FileUp,
  Sheet,
  Presentation,
  Projector,
  Tags,
  Type,
  ImagePlus,
  PenTool,
  Highlighter,
  Shapes,
  PenLine,
  CheckSquare,
  Lock,
  Unlock,
  GitCompare,
  ScanText,
  ScanLine,
  Paperclip,
  Maximize2,
  Info,
  Archive,
  Star,
  ArrowUpRight,
} from 'lucide-react';
import { ToolDefinition } from '../tools/toolsRegistry';
import { toggleFavoriteTool } from '../utils/recentTools';

interface ToolCardProps {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onSelect: (toolId: string) => void;
  onFavoriteChange?: (toolId: string, isFav: boolean) => void;
}

// Icon dictionary
const ICON_MAP: Record<string, React.ElementType> = {
  Combine,
  Split,
  Trash2,
  FileCheck2,
  LayoutGrid,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  Wrench,
  FileArchive,
  Layers2,
  Globe,
  Contrast,
  FastForward,
  Image,
  ImageIcon,
  FileImage,
  Code,
  FileText,
  ImageDown,
  FileSpreadsheet,
  FilePieChart,
  AlignLeft,
  FileCode2,
  Binary,
  FileUp,
  Sheet,
  Presentation,
  Projector,
  Tags,
  Type,
  ImagePlus,
  PenTool,
  Highlighter,
  Shapes,
  PenLine,
  CheckSquare,
  Lock,
  Unlock,
  GitCompare,
  ScanText,
  ScanLine,
  Paperclip,
  Maximize2,
  Info,
  Archive,
};

// Subtle category-specific accent styles
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Organize PDF': {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/60 dark:border-blue-800/60',
  },
  'Optimize PDF': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/60 dark:border-emerald-800/60',
  },
  'Convert to PDF': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200/60 dark:border-indigo-800/60',
  },
  'Convert from PDF': {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200/60 dark:border-purple-800/60',
  },
  'Office Conversions': {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/60 dark:border-amber-800/60',
  },
  'Edit PDF': {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200/60 dark:border-pink-800/60',
  },
  'Security and Advanced': {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/60 dark:border-rose-800/60',
  },
};

export default function ToolCard({ tool, isFavorite = false, onSelect, onFavoriteChange }: ToolCardProps) {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;
  const catStyle = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES['Organize PDF'];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFav = toggleFavoriteTool(tool.id);
    onFavoriteChange?.(tool.id, newFav);
  };

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 cursor-pointer text-left"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(tool.id);
        }
      }}
    >
      <div>
        {/* Top bar with icon, number, badges, and favorite */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110 ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800">
                {tool.badge}
              </span>
            )}
            <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
              #{tool.number}
            </span>
            <button
              onClick={handleFavoriteClick}
              className="p-1 rounded-lg text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400 transition-colors focus:outline-none"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Category */}
        <div className="mb-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
            <span>{tool.title}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
          </h3>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
            {tool.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Card bottom hint */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>{tool.acceptedExtensions}</span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Open tool →
        </span>
      </div>
    </div>
  );
}
