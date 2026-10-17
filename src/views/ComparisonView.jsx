import React, { useState, useMemo } from 'react';
import {
  Columns,
  Sparkles,
  ArrowRight,
  Layers,
  CheckCircle2,
  Table,
  Eye,
  GitFork,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import {
  getPureTraversalOrder,
  ALGORITHM_TYPES,
  ALGORITHM_METADATA,
} from '../algorithms/traversalEngine';
import { PRESET_TREES } from '../data/presetTrees';
import { buildTreeFromLevelOrder } from '../algorithms/treeModel';

export default function ComparisonView({
  tree,
  setTree,
  setActiveTab,
}) {
  const [activePreviewAlgo, setActivePreviewAlgo] = useState(ALGORITHM_TYPES.INORDER);

  // Compute traversal outputs for the current tree
  const preorderList = useMemo(() => getPureTraversalOrder(tree, ALGORITHM_TYPES.PREORDER), [tree]);
  const inorderList = useMemo(() => getPureTraversalOrder(tree, ALGORITHM_TYPES.INORDER), [tree]);
  const postorderList = useMemo(() => getPureTraversalOrder(tree, ALGORITHM_TYPES.POSTORDER), [tree]);

  // Map of node IDs to visit order index for each algorithm
  // To generate exact badge map, we do a quick trace
  const getOrderBadgeMap = (algorithm) => {
    if (!tree) return {};
    const map = {};
    let counter = 1;

    function walk(node) {
      if (!node) return;
      if (algorithm === ALGORITHM_TYPES.PREORDER) {
        map[node.id] = counter++;
        walk(node.left);
        walk(node.right);
      } else if (algorithm === ALGORITHM_TYPES.INORDER) {
        walk(node.left);
        map[node.id] = counter++;
        walk(node.right);
      } else if (algorithm === ALGORITHM_TYPES.POSTORDER) {
        walk(node.left);
        walk(node.right);
        map[node.id] = counter++;
      }
    }

    walk(tree);
    return map;
  };

  const activeBadgeMap = useMemo(() => {
    return getOrderBadgeMap(activePreviewAlgo);
  }, [tree, activePreviewAlgo]);

  const allVisitedIds = useMemo(() => {
    return Object.keys(activeBadgeMap);
  }, [activeBadgeMap]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Columns className="w-5 h-5 text-indigo-500" />
            <span>Traversal Comparison</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Compare Preorder, Inorder, and Postorder on the exact same tree side by side.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all"
          >
            Edit Tree
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Open Simulator
          </button>
        </div>
      </div>

      {/* Synchronized Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Preorder Output Card */}
        <div
          onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.PREORDER)}
          className={`glass-card rounded-3xl p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
            activePreviewAlgo === ALGORITHM_TYPES.PREORDER
              ? 'border-blue-500 bg-white dark:bg-slate-900/90 shadow-lg shadow-blue-500/10'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Preorder (N-L-R)
            </span>
            {activePreviewAlgo === ALGORITHM_TYPES.PREORDER && (
              <span className="text-[10px] font-semibold text-blue-500 dark:text-blue-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Active on Canvas</span>
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Root → Left → Right</div>
          <div className="min-h-[56px] bg-slate-50 dark:bg-slate-950 rounded-2xl p-3 border border-slate-200 dark:border-slate-800/80 font-mono text-xs flex flex-wrap items-center gap-1.5 text-blue-600 dark:text-blue-300">
            {preorderList.length > 0 ? (
              preorderList.map((val, idx) => (
                <span key={idx} className="bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-bold">
                  {val}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">Empty tree</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Root is visited <strong>first</strong>. Perfect for cloning and prefix math expressions.
          </p>
        </div>

        {/* Inorder Output Card */}
        <div
          onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.INORDER)}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all ${
            activePreviewAlgo === ALGORITHM_TYPES.INORDER
              ? 'border-emerald-500 bg-slate-900/90 shadow-lg shadow-emerald-500/10'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              Inorder (L-N-R)
            </span>
            {activePreviewAlgo === ALGORITHM_TYPES.INORDER && (
              <span className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Active On Canvas</span>
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-white mb-2">Left → Root → Right</div>
          <div className="min-h-[56px] bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs flex flex-wrap items-center gap-1.5 text-emerald-300">
            {inorderList.length > 0 ? (
              inorderList.map((val, idx) => (
                <span key={idx} className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {val}
                </span>
              ))
            ) : (
              <span className="text-slate-600 italic">Empty tree</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Root is visited in the <strong>middle</strong>. Returns sorted values for any valid BST!
          </p>
        </div>

        {/* Postorder Output Card */}
        <div
          onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.POSTORDER)}
          className={`glass-card rounded-2xl p-5 border cursor-pointer transition-all ${
            activePreviewAlgo === ALGORITHM_TYPES.POSTORDER
              ? 'border-purple-500 bg-slate-900/90 shadow-lg shadow-purple-500/10'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Postorder (L-R-N)
            </span>
            {activePreviewAlgo === ALGORITHM_TYPES.POSTORDER && (
              <span className="text-[10px] font-semibold text-purple-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Active On Canvas</span>
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-white mb-2">Left → Right → Root</div>
          <div className="min-h-[56px] bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs flex flex-wrap items-center gap-1.5 text-purple-300">
            {postorderList.length > 0 ? (
              postorderList.map((val, idx) => (
                <span key={idx} className="bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  {val}
                </span>
              ))
            ) : (
              <span className="text-slate-600 italic">Empty tree</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Root is visited <strong>last</strong>. Ideal for memory deallocation and postfix RPN math.
          </p>
        </div>
      </div>

      {/* Synchronized Tree Canvas with Numbered Badges */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Tree Visitation Order Overlay:</span>
              <span className="font-mono text-indigo-400">
                {ALGORITHM_METADATA[activePreviewAlgo].name}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Numbered badges indicate the precise sequential order in which each node is visited.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.PREORDER)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreviewAlgo === ALGORITHM_TYPES.PREORDER
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preorder Badges
            </button>
            <button
              onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.INORDER)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreviewAlgo === ALGORITHM_TYPES.INORDER
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inorder Badges
            </button>
            <button
              onClick={() => setActivePreviewAlgo(ALGORITHM_TYPES.POSTORDER)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePreviewAlgo === ALGORITHM_TYPES.POSTORDER
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Postorder Badges
            </button>
          </div>
        </div>

        <TreeVisualizer
          root={tree}
          visitedNodeIds={allVisitedIds}
          visitedOrderMap={activeBadgeMap}
          showNodeNumbers={true}
          height="420px"
          interactive={false}
        />
      </div>

      {/* Comprehensive Comparison Summary Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Table className="w-5 h-5 text-blue-400" />
          <span>Algorithmic Comparison Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono bg-slate-900/50">
                <th className="p-3">Algorithm</th>
                <th className="p-3">Visiting Order</th>
                <th className="p-3">Root Position</th>
                <th className="p-3">Time Complexity</th>
                <th className="p-3">Auxiliary Space</th>
                <th className="p-3">Primary Use Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="p-3 font-bold text-blue-400">Preorder</td>
                <td className="p-3 font-mono">Node → Left → Right</td>
                <td className="p-3 font-semibold text-blue-300">First</td>
                <td className="p-3 font-mono text-emerald-400">O(N)</td>
                <td className="p-3 font-mono text-blue-400">O(H)</td>
                <td className="p-3 text-slate-300">Tree cloning, prefix expression parsing, serialization</td>
              </tr>
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="p-3 font-bold text-emerald-400">Inorder</td>
                <td className="p-3 font-mono">Left → Node → Right</td>
                <td className="p-3 font-semibold text-emerald-300">Middle</td>
                <td className="p-3 font-mono text-emerald-400">O(N)</td>
                <td className="p-3 font-mono text-blue-400">O(H)</td>
                <td className="p-3 text-slate-300">Sorted retrieval in BSTs, infix expression evaluation</td>
              </tr>
              <tr className="hover:bg-slate-900/30 transition-colors">
                <td className="p-3 font-bold text-purple-400">Postorder</td>
                <td className="p-3 font-mono">Left → Right → Node</td>
                <td className="p-3 font-semibold text-purple-300">Last</td>
                <td className="p-3 font-mono text-emerald-400">O(N)</td>
                <td className="p-3 font-mono text-blue-400">O(H)</td>
                <td className="p-3 text-slate-300">Subtree memory cleanup/deletion, Reverse Polish notation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
