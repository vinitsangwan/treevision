import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import TreeBuilderView from './views/TreeBuilderView';
import SimulatorView from './views/SimulatorView';
import ComparisonView from './views/ComparisonView';
import { buildTreeFromLevelOrder, treeToLevelOrder } from './algorithms/treeModel';
import { PRESET_TREES } from './data/presetTrees';
import { Network } from 'lucide-react';

const STORAGE_KEY_TREE = 'treevision_saved_tree';
const STORAGE_KEY_THEME = 'treevision_saved_theme';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // Initialize tree from localStorage or default preset
  const [tree, setTree] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TREE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return buildTreeFromLevelOrder(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load tree from localStorage:', e);
    }
    // Default balanced tree
    return buildTreeFromLevelOrder(PRESET_TREES[0].levelOrder);
  });

  // Save tree to localStorage whenever it changes
  useEffect(() => {
    try {
      if (tree) {
        const levelOrder = treeToLevelOrder(tree);
        localStorage.setItem(STORAGE_KEY_TREE, JSON.stringify(levelOrder));
      } else {
        localStorage.setItem(STORAGE_KEY_TREE, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('Could not save tree to localStorage:', e);
    }
  }, [tree]);

  // Handle Theme switching reliably on <html> element
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onSelectPreset={(preset) => {
              setTree(buildTreeFromLevelOrder(preset.levelOrder));
              setActiveTab('simulator');
            }}
          />
        )}

        {activeTab === 'builder' && (
          <TreeBuilderView
            tree={tree}
            setTree={setTree}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView
            tree={tree}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            tree={tree}
            setTree={setTree}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md py-8 mt-auto text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Network className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 dark:text-white">TreeVision</span> — Binary Tree Traversal Simulator
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
            <span>Preorder • Inorder • Postorder</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <span>100% Client-Side & Offline Capable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
