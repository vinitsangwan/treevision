import React from 'react';
import {
  PlayCircle,
  Network,
  ArrowRight,
  Zap,
  CheckCircle2,
  TreeDeciduous,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import { PRESET_TREES } from '../data/presetTrees';
import { buildTreeFromLevelOrder } from '../algorithms/treeModel';

export default function HomeView({ setActiveTab }) {
  const sampleTree = buildTreeFromLevelOrder(PRESET_TREES[0].levelOrder);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-300 text-xs font-medium">
            <TreeDeciduous className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Data Structures & Algorithms Visualizer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            See the algorithm. <br />
            Understand the tree.
          </h1>

          <p className="max-w-xl mx-auto text-slate-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed font-normal">
            A clear, visual playground for binary tree traversals. Step through recursive calls at your own pace and watch each node respond.
          </p>

          {/* Clean Human Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700 shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Network className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
              <span>Build Custom Tree</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm bg-slate-100 dark:bg-zinc-800/60 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/60 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Compare All</span>
            </button>
          </div>
        </div>

        {/* Tree Preview Showcase */}
        <div className="max-w-4xl mx-auto mt-12 px-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-zinc-800 shadow-lg">
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span className="text-slate-600 dark:text-zinc-400 font-medium ml-2">Binary Tree Visualizer</span>
              </div>
              <div className="text-slate-500 dark:text-zinc-400 text-xs font-mono">
                Sample Tree: 7 nodes
              </div>
            </div>

            <TreeVisualizer
              root={sampleTree}
              activeNodeId={sampleTree?.left?.id}
              visitedNodeIds={[sampleTree?.id, sampleTree?.left?.id]}
              activeEdge={{ fromId: sampleTree?.id, toId: sampleTree?.left?.id }}
              height="340px"
              interactive={false}
            />

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
              <div className="flex items-center gap-2 font-mono">
                <span>Output Order:</span>
                <span className="text-slate-900 dark:text-white font-semibold">[ 10, 5 ... ]</span>
              </div>
              <button
                onClick={() => setActiveTab('simulator')}
                className="text-slate-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 group"
              >
                <span>Open in simulator</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Traversal Feature Cards */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Three Traversal Strategies</h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            The difference between traversals comes down to when the parent node is processed relative to its left and right subtrees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Preorder */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                  Node → Left → Right
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">O(N)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Preorder
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Processes the root node first before recursing deeply into the left and right subtrees.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                  <span>Tree cloning & serialization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                  <span>Prefix mathematical expressions</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Simulate Preorder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Inorder */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                  Left → Node → Right
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">O(N)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Inorder
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Explores the left branch first, visits the node, then goes right. On a BST, this yields strictly sorted order!
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Sorted keys on any valid BST</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Arithmetic infix notations</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Simulate Inorder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Postorder */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-medium text-slate-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                  Left → Right → Node
                </span>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">O(N)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Postorder
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Traverses both left and right subtrees completely before visiting the node. Root is always visited last.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                  <span>Clean bottom-up tree deallocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                  <span>Postfix calculator evaluation</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('simulator')}
              className="mt-6 w-full py-2.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Simulate Postorder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Traversal Summary Card */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                Memory Aid
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                How to remember traversal order
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">
                The prefix of the traversal name indicates where the parent node is processed:
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-slate-900 dark:text-white font-semibold">Pre-order:</strong> Root is at the <strong>beginning</strong> (Root, Left, Right).
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-slate-900 dark:text-white font-semibold">In-order:</strong> Root is in the <strong>middle</strong> (Left, Root, Right).
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-slate-900 dark:text-white font-semibold">Post-order:</strong> Root is at the <strong>end</strong> (Left, Right, Root).
                </div>
              </div>
            </div>

            {/* Quick table */}
            <div className="bg-slate-100 dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
                Traversal Cheat Sheet
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 font-mono">
                      <th className="pb-2">Algorithm</th>
                      <th className="pb-2">Processing Order</th>
                      <th className="pb-2">Root Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">Preorder</td>
                      <td className="py-2.5 font-mono">Node → Left → Right</td>
                      <td className="py-2.5 text-slate-600 dark:text-zinc-400">First</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">Inorder</td>
                      <td className="py-2.5 font-mono">Left → Node → Right</td>
                      <td className="py-2.5 text-slate-600 dark:text-zinc-400">Middle</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-900 dark:text-white">Postorder</td>
                      <td className="py-2.5 font-mono">Left → Right → Node</td>
                      <td className="py-2.5 text-slate-600 dark:text-zinc-400">Last</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl bg-slate-100 dark:bg-zinc-900 p-6 sm:p-8 border border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Ready to experiment with a binary tree?
              </h3>
              <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
                Try standard presets or craft custom nodes directly on the canvas.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('simulator')}
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Launch Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
              >
                <Network className="w-4 h-4 text-slate-500" />
                <span>Tree Builder</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
