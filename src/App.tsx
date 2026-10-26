import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ToolSearch from './components/ToolSearch';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import ToolWorkspace from './pages/ToolWorkspace';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import { getToolById } from './tools/toolsRegistry';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'all-tools' | 'tool' | 'pricing' | 'about' | 'contact' | 'privacy' | 'terms' | 'help' | 'cookie'>('home');
  const [activeToolId, setActiveToolId] = useState<string>('merge-pdf');
  const [initialCategoryFilter, setInitialCategoryFilter] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Synchronize document title
  useEffect(() => {
    if (currentTab === 'home') {
      document.title = 'PDF Master Pro — All-in-One Professional PDF Workspace';
    } else if (currentTab === 'tool') {
      const tool = getToolById(activeToolId);
      document.title = tool
        ? `${tool.title} — PDF Master Pro`
        : 'PDF Tool Workspace — PDF Master Pro';
    } else if (currentTab === 'all-tools') {
      document.title = 'All 50 PDF Tools Directory — PDF Master Pro';
    } else if (currentTab === 'pricing') {
      document.title = 'Pricing & Architecture — PDF Master Pro';
    } else if (currentTab === 'about') {
      document.title = 'About Us — PDF Master Pro';
    } else if (currentTab === 'privacy') {
      document.title = 'Privacy Policy — PDF Master Pro';
    } else if (currentTab === 'terms') {
      document.title = 'Terms of Service — PDF Master Pro';
    } else if (currentTab === 'help') {
      document.title = 'Help Center & Guidelines — PDF Master Pro';
    } else if (currentTab === 'contact') {
      document.title = 'Contact Support — PDF Master Pro';
    }
  }, [currentTab, activeToolId]);

  const handleNavigate = (tab: string, arg?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'tool' && arg) {
      setActiveToolId(arg);
      setCurrentTab('tool');
    } else if (tab === 'all-tools') {
      setInitialCategoryFilter(arg);
      setCurrentTab('all-tools');
    } else if (tab === 'cookie') {
      setCurrentTab('privacy'); // Cookie policy is part of privacy policy
    } else {
      setInitialCategoryFilter(undefined);
      setCurrentTab(tab as any);
    }
  };

  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    setCurrentTab('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            onSelectTool={handleSelectTool}
            onNavigateTab={handleNavigate}
          />
        )}

        {currentTab === 'all-tools' && (
          <AllTools
            onSelectTool={handleSelectTool}
            initialCategory={initialCategoryFilter}
          />
        )}

        {currentTab === 'tool' && (
          <ToolWorkspace
            toolId={activeToolId}
            onBack={() => setCurrentTab('all-tools')}
            onNavigateTool={handleSelectTool}
          />
        )}

        {currentTab === 'pricing' && <Pricing />}
        {currentTab === 'about' && <About onNavigateTab={handleNavigate} />}
        {currentTab === 'contact' && <Contact />}
        {currentTab === 'privacy' && <Privacy />}
        {currentTab === 'terms' && <Terms />}
        {currentTab === 'help' && <Help />}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Universal Search Modal (Ctrl+K) */}
      <ToolSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
