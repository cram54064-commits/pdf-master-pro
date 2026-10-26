import React, { useState } from 'react';
import {
  FileText,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getToolById } from '../tools/toolsRegistry';
import { getRecentTools } from '../utils/recentTools';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, toolId?: string) => void;
  onOpenSearch: () => void;
}

export default function Header({ currentTab, onNavigate, onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recentDropdownOpen, setRecentDropdownOpen] = useState(false);

  const recentIds = getRecentTools().slice(0, 5);
  const recentTools = recentIds.map((id) => getToolById(id)).filter(Boolean);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'all-tools', label: 'All PDF Tools' },
    { id: 'convert', label: 'Convert PDF', toolCategory: 'Convert to PDF' },
    { id: 'edit', label: 'Edit PDF', toolCategory: 'Edit PDF' },
    { id: 'compress', label: 'Compress PDF', toolId: 'compress-pdf' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'help', label: 'Help' },
  ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    setMobileMenuOpen(false);
    setRecentDropdownOpen(false);
    if (link.toolId) {
      onNavigate('tool', link.toolId);
    } else if (link.toolCategory) {
      onNavigate('all-tools', link.toolCategory);
    } else {
      onNavigate(link.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  PDF Master <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Secure Client-Side Document Suite
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link)}
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  currentTab === link.id
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Recent Tools Dropdown */}
            {recentTools.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setRecentDropdownOpen(!recentDropdownOpen)}
                  className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1"
                >
                  <span>Recent</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {recentDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50">
                    <div className="text-xs font-semibold uppercase text-slate-400 px-3 py-1.5 tracking-wider">
                      Recently Used
                    </div>
                    {recentTools.map((t) => (
                      <button
                        key={t!.id}
                        onClick={() => {
                          setRecentDropdownOpen(false);
                          onNavigate('tool', t!.id);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors group"
                      >
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                          {t!.number}
                        </span>
                        <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {t!.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Action Items */}
          <div className="flex items-center gap-2">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700"
              title="Search all 50 PDF tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search 50 tools...</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 shadow-xs">
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* CTA Button */}
            <button
              onClick={() => onNavigate('all-tools')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Explore Tools</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="px-4 py-2.5 text-base font-semibold text-left text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 rounded-xl"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('all-tools');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 font-bold text-white bg-indigo-600 rounded-xl"
                >
                  <span>Browse All 50 PDF Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
