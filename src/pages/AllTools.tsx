import React, { useState } from 'react';
import { Search, Filter, Layers, Zap, FileInput, FileOutput, FileSpreadsheet, Edit3, ShieldCheck } from 'lucide-react';
import { ALL_TOOLS, CATEGORIES, ToolCategory } from '../tools/toolsRegistry';
import ToolCard from '../components/ToolCard';
import { getFavoriteTools } from '../utils/recentTools';

interface AllToolsProps {
  onSelectTool: (toolId: string) => void;
  initialCategory?: string;
}

export default function AllTools({ onSelectTool, initialCategory }: AllToolsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(getFavoriteTools());

  const handleFavoriteChange = (toolId: string, isFav: boolean) => {
    setFavorites(getFavoriteTools());
  };

  const filteredTools = ALL_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Favorites' ? favorites.includes(tool.id) : tool.category === selectedCategory);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return (
      matchesCategory &&
      (tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        `#${tool.number}`.includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* Directory Title */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All 50 PDF Productivity Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
          A complete, categorized workstation for reading, modifying, compressing, transforming, and securing PDF
          files directly in your web browser.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by name, action, or #number..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs text-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          All 50 Tools
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Tools Display */}
      {selectedCategory === 'All' && !searchQuery ? (
        // Grouped by Category for structured exploration
        <div className="space-y-12">
          {CATEGORIES.map((cat) => {
            const catTools = ALL_TOOLS.filter((t) => t.category === cat.id);
            return (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{cat.label}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {catTools.length} tools
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {catTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      isFavorite={favorites.includes(tool.id)}
                      onSelect={onSelectTool}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Filtered Grid
        <div>
          <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {filteredTools.length} matching tools
          </div>
          {filteredTools.length === 0 ? (
            <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-400 font-semibold">
                No tools found matching "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-semibold underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favorites.includes(tool.id)}
                  onSelect={onSelectTool}
                  onFavoriteChange={handleFavoriteChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
