import React from 'react';
import {
  PlayCircle,
  Network,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  Layers,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import { PRESET_TREES } from '../data/presetTrees';
import { buildTreeFromLevelOrder } from '../algorithms/treeModel';

export default function HomeView({ setActiveTab, onSelectPreset }) {
  const sampleTree = buildTreeFromLevelOrder(PRESET_TREES[0].levelOrder);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Interactive Data Structures & Algorithms Simulator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            See the Algorithm. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Understand the Tree.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Master binary tree recursive traversals through high-fidelity visual simulations,
            real-time call stack tracking, dynamic tree builders, and step-by-step algorithmic pseudocode.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Start Simulation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-lg hover:scale-105 transition-all"
            >
              <Network className="w-5 h-5 text-indigo-400" />
              <span>Build Your Tree</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Compare All 3</span>
            </button>
          </div>
        </div>

        {/* Interactive Tree Preview Showcase */}
        <div className="max-w-4xl mx-auto mt-12 px-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-700/60">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="font-mono text-slate-400 ml-2">Live Binary Tree Canvas Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px]">
                  Balanced BST (7 Nodes)
                </span>
              </div>
            </div>

            <TreeVisualizer
              root={sampleTree}
              activeNodeId={sampleTree?.left?.id}
              visitedNodeIds={[sampleTree?.id, sampleTree?.left?.id]}
              activeEdge={{ fromId: sampleTree?.id, toId: sampleTree?.left?.id }}
              height="360px"
              interactive={false}
            />

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-500">Output Stream:</span>
                <span className="text-blue-400 font-semibold">[ 10, 5 ... ]</span>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group"
              >
                <span>Open in full simulator with playback</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traversal Feature Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Three Fundamental Traversal Strategies</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Tree traversal is the process of visiting each node in a tree data structure exactly once.
            The order depends on when the parent node is processed relative to its children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preorder Card */}
          <div className="glass-card rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                Root → Left → Right
              </span>
              <span className="text-xs font-mono text-slate-500">O(N)</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
              Preorder Traversal
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Visits the current root node first before deeply traversing the left subtree followed by the right subtree.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Tree duplication & cloning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Prefix expression syntax trees</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Preorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inorder Card */}
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-900/90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                Left → Root → Right
              </span>
              <span className="text-xs font-mono text-slate-500">O(N)</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              Inorder Traversal
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Explores left subtree completely, visits the root node, and then recurses through the right subtree.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Yields strictly sorted keys for BSTs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Arithmetic infix evaluation</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Inorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Postorder Card */}
          <div className="glass-card rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-900/90 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                Left → Right → Root
              </span>
              <span className="text-xs font-mono text-slate-500">O(N)</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
              Postorder Traversal
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Visits both subtrees (bottom-up) before processing the parent node. Root is visited strictly last.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Bottom-up subtree memory deallocation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Postfix / Reverse Polish calculation</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-5 w-full py-2.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <span>Simulate Postorder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Tree Traversal Matters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-2xl p-8 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Theoretical Significance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Why is Binary Tree Traversal Essential in Computer Science?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Unlike linear data structures (arrays, linked lists) where elements have a single natural traversal order,
                hierarchical structures like trees can be explored along different dimensions.
              </p>
              <div className="space-y-3 pt-2 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white font-medium">Non-Linear Navigation:</strong> Trees branch recursively.
                    Traversals guarantee that all subproblems are addressed deterministically without infinite loops or missed nodes.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white font-medium">Compilers & Syntax Trees:</strong> Compilers parse high-level code
                    into Abstract Syntax Trees (ASTs) and employ Postorder/Preorder walks for code generation and optimization.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white font-medium">Databases & Indexing:</strong> B-Trees and BSTs organize indices on disk.
                    Range queries rely directly on in-order range scans.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Traversal Comparison Table on Home */}
            <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Traversal Techniques Compared at a Glance</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="pb-2">Algorithm</th>
                      <th className="pb-2">Processing Order</th>
                      <th className="pb-2">Root Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-semibold text-blue-400">Preorder</td>
                      <td className="py-2.5 font-mono">Node → Left → Right</td>
                      <td className="py-2.5 text-blue-300">First (Index 1)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-emerald-400">Inorder</td>
                      <td className="py-2.5 font-mono">Left → Node → Right</td>
                      <td className="py-2.5 text-emerald-300">Middle (Between subtrees)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-purple-400">Postorder</td>
                      <td className="py-2.5 font-mono">Left → Right → Node</td>
                      <td className="py-2.5 text-purple-300">Last (Index N)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Tip: Notice how the prefix, infix, and postfix positions of the root node define the name of each traversal!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-indigo-500/20 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Interactive Traversal Simulator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Ready to explore binary tree traversals in action?
              </h3>
              <p className="text-slate-300 text-sm max-w-2xl">
                Watch nodes light up step by step, track recursive call stack executions, and inspect
                synchronized algorithm pseudocode in real time.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:opacity-95 transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Network className="w-4 h-4 text-indigo-400" />
                <span>Build Tree</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
