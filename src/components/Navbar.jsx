import React, { useState } from 'react';
import {
  Network,
  PlayCircle,
  Home,
  Columns,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Tree Builder', icon: Network },
    { id: 'simulator', label: 'Simulator', icon: PlayCircle },
    { id: 'compare', label: 'Compare All', icon: Columns },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6">
      {/* Human-Crafted Floating Pill Navigation Bar */}
      <div className="max-w-4xl mx-auto rounded-full glass-panel border border-slate-200 dark:border-zinc-800 shadow-md px-3 sm:px-4 py-2 flex items-center justify-between backdrop-blur-xl transition-all duration-300">
        
        {/* Brand Identity */}
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none pl-1"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-all">
            <Network className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              TreeVision
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Clean Neutral Pill Tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-zinc-900/80 p-1 rounded-full border border-slate-200 dark:border-zinc-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions Right */}
        <div className="flex items-center gap-2 pr-1">
          {/* Quick Launch Simulator Button */}
          <button
            onClick={() => handleSelectTab('simulator')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulator</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 hover:scale-105 active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-3 shadow-xl backdrop-blur-xl space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
