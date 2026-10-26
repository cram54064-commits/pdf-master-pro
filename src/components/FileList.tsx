import React from 'react';
import { FileText, Trash2, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { formatFileSize } from '../utils/formatFileSize';

export interface UploadedFileItem {
  id: string;
  file: File;
  buffer: ArrayBuffer;
  pageCount?: number;
}

interface FileListProps {
  files: UploadedFileItem[];
  onRemove: (id: string) => void;
  onReorder?: (newOrder: UploadedFileItem[]) => void;
  onClearAll?: () => void;
  allowReorder?: boolean;
}

export default function FileList({
  files,
  onRemove,
  onReorder,
  onClearAll,
  allowReorder = true,
}: FileListProps) {
  if (files.length === 0) return null;

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!onReorder) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(targetIndex, 0, moved);
    onReorder(newFiles);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Selected Files ({files.length})
          </span>
          <span className="text-xs text-slate-400">
            Total:{' '}
            {formatFileSize(files.reduce((acc, f) => acc + f.file.size, 0))}
          </span>
        </div>

        {onClearAll && files.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {files.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {item.file.name}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{formatFileSize(item.file.size)}</span>
                  {item.pageCount !== undefined && item.pageCount > 0 && (
                    <>
                      <span>•</span>
                      <span>{item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-3">
              {allowReorder && files.length > 1 && (
                <>
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer ml-1"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
