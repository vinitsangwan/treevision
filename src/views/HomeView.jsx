import React from 'react';
import {
  PlayCircle,
  Network,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Heart,
  Smile,
  Compass,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import { PRESET_TREES } from '../data/presetTrees';
import { buildTreeFromLevelOrder } from '../algorithms/treeModel';

export default function HomeView({ setActiveTab }) {
  const sampleTree = buildTreeFromLevelOrder(PRESET_TREES[0].levelOrder);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        {/* Subtle warm ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>An intuitive visual guide to binary trees</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            See the Algorithm. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Understand the Tree.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            No more guessing how recursion unwinds. Watch nodes illuminate in real time, follow the call stack step by step, and build custom trees with a single click.
          </p>

          {/* Friendly highlight chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              🌱 Beginner friendly
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              🎮 Step-by-step playback
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              ⚡ 100% interactive sandbox
            </span>
          </div>

          {/* Call to Actions (Friendly Tactile Buttons) */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Simulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Network className="w-4 h-4 text-indigo-500" />
              <span>Build Your Tree</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Compare All 3</span>
            </button>
          </div>
        </div>

        {/* Interactive Tree Preview Showcase */}
        <div className="max-w-4xl mx-auto mt-12 px-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-mono text-slate-500 dark:text-slate-400 ml-2">Interactive Canvas Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-semibold border border-blue-500/20">
                  Balanced BST (7 Nodes)
                </span>
              </div>
            </div>

            <TreeVisualizer
              root={sampleTree}
              activeNodeId={sampleTree?.left?.id}
              visitedNodeIds={[sampleTree?.id, sampleTree?.left?.id]}
              activeEdge={{ fromId: sampleTree?.id, toId: sampleTree?.left?.id }}
              height="350px"
              interactive={false}
            />

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span>Output Stream:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">[ 10, 5 ... ]</span>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 group"
              >
                <span>Open in full simulator with playback controls</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traversal Feature Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Three Traversal Strategies, Explained</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Every traversal visits every node once. What makes each unique is simply *when* the parent node gets visited relative to its children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preorder Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  Root → Left → Right
                </span>
                <span className="text-xs font-mono text-slate-400">O(N)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Preorder
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                Visit me first! The algorithm processes the current node immediately, then explores the left subtree, then the right.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Cloning and duplicating trees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Prefix expression syntax trees</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Preorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inorder Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Left → Root → Right
                </span>
                <span className="text-xs font-mono text-slate-400">O(N)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Inorder
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                Left first, then me, then right. In a Binary Search Tree (BST), this naturally visits every number in sorted order!
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Returns sorted keys for any BST</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Arithmetic infix expressions</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-600/15 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Inorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Postorder Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-purple-400/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Left → Right → Root
                </span>
                <span className="text-xs font-mono text-slate-400">O(N)</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Postorder
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                Children first, parent last. Both subtrees are finished before visiting the parent node — essential for clean bottom-up tasks.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Deleting subtrees cleanly</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <span>Postfix calculator evaluation</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-600/15 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Postorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Helpful Comparison Summary */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-indigo-500 uppercase tracking-wider">
                💡 Mental Model
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                How to remember them effortlessly
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                The name always tells you where the <strong>Root</strong> sits relative to the subtrees:
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <strong className="text-blue-600 dark:text-blue-400 font-semibold">Pre-order:</strong> Root is at the <em>front</em> (Root, Left, Right).
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">In-order:</strong> Root is in the <em>middle</em> (Left, Root, Right).
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <strong className="text-purple-600 dark:text-purple-400 font-semibold">Post-order:</strong> Root is at the <em>end</em> (Left, Right, Root).
                </div>
              </div>
            </div>

            {/* Quick table */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                Traversal Cheat Sheet
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono">
                      <th className="pb-2">Algorithm</th>
                      <th className="pb-2">Processing Order</th>
                      <th className="pb-2">Root Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="py-2.5 font-bold text-blue-600 dark:text-blue-400">Preorder</td>
                      <td className="py-2.5 font-mono">Node → Left → Right</td>
                      <td className="py-2.5 text-blue-600 dark:text-blue-300">First</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">Inorder</td>
                      <td className="py-2.5 font-mono">Left → Node → Right</td>
                      <td className="py-2.5 text-emerald-600 dark:text-emerald-300">Middle</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-purple-600 dark:text-purple-400">Postorder</td>
                      <td className="py-2.5 font-mono">Left → Right → Node</td>
                      <td className="py-2.5 text-purple-600 dark:text-purple-300">Last</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/20 via-indigo-900/15 to-purple-900/20 border border-indigo-500/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Ready to experiment?</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Build a tree or watch a simulation right now
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl">
                Load presets like balanced, skewed, or expression trees, or customize your own nodes in seconds.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Network className="w-4 h-4 text-indigo-500" />
                <span>Build Tree</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
