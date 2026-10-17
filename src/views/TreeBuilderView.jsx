import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Dices,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  GitCommit,
  X,
  PlayCircle,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import {
  buildTreeFromLevelOrder,
  treeToLevelOrder,
  insertChild,
  updateNodeValue,
  deleteNode,
  calculateTreeMetrics,
  generateRandomTree,
  cloneTree,
} from '../algorithms/treeModel';
import { PRESET_TREES } from '../data/presetTrees';

export default function TreeBuilderView({
  tree,
  setTree,
  setActiveTab,
  onSaveTree,
}) {
  const [levelOrderInput, setLevelOrderInput] = useState('10, 5, 20, 3, 7, 15, 25');
  const [selectedNode, setSelectedNode] = useState(null);
  const [validationMsg, setValidationMsg] = useState({ type: 'info', text: 'Enter comma-separated values in BFS level-order.' });
  const [editValue, setEditValue] = useState('');
  const [newLeftValue, setNewLeftValue] = useState('');
  const [newRightValue, setNewRightValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Undo / History support
  const [history, setHistory] = useState([]);

  const pushHistory = (currentTree) => {
    setHistory((prev) => [...prev.slice(-15), cloneTree(currentTree)]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setTree(previous);
    setSelectedNode(null);
    setValidationMsg({ type: 'info', text: 'Undid last tree modification.' });
  };

  // Tree Metrics calculation
  const metrics = calculateTreeMetrics(tree);

  // Parse and build tree from level-order input
  const handleBuildFromInput = (e) => {
    if (e) e.preventDefault();
    try {
      if (!levelOrderInput.trim()) {
        pushHistory(tree);
        setTree(null);
        setSelectedNode(null);
        setValidationMsg({ type: 'info', text: 'Created an empty tree.' });
        return;
      }

      const newTree = buildTreeFromLevelOrder(levelOrderInput);
      if (!newTree) {
        setValidationMsg({ type: 'error', text: 'Invalid level-order format. Example: 10, 5, 20, 3, 7, 15, 25' });
        return;
      }

      pushHistory(tree);
      setTree(newTree);
      setSelectedNode(null);
      setValidationMsg({
        type: 'success',
        text: `Tree successfully built with ${calculateTreeMetrics(newTree).size} nodes from level-order data!`,
      });
    } catch (err) {
      setValidationMsg({ type: 'error', text: `Failed to construct tree: ${err.message}` });
    }
  };

  // Node selection callback
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setEditValue(String(node.value));
    setNewLeftValue('');
    setNewRightValue('');
    setConfirmDelete(false);
  };

  // Add Left Child
  const handleAddLeft = () => {
    if (!selectedNode || !newLeftValue.trim()) return;
    pushHistory(tree);
    const updated = insertChild(tree, selectedNode.id, newLeftValue.trim(), 'left');
    setTree(updated);
    setNewLeftValue('');
    setSelectedNode(null);
    setValidationMsg({ type: 'success', text: `Added left child to node ${selectedNode.value}.` });
  };

  // Add Right Child
  const handleAddRight = () => {
    if (!selectedNode || !newRightValue.trim()) return;
    pushHistory(tree);
    const updated = insertChild(tree, selectedNode.id, newRightValue.trim(), 'right');
    setTree(updated);
    setNewRightValue('');
    setSelectedNode(null);
    setValidationMsg({ type: 'success', text: `Added right child to node ${selectedNode.value}.` });
  };

  // Edit Value
  const handleEditValue = () => {
    if (!selectedNode || !editValue.trim()) return;
    pushHistory(tree);
    const updated = updateNodeValue(tree, selectedNode.id, editValue.trim());
    setTree(updated);
    setSelectedNode(null);
    setValidationMsg({ type: 'success', text: `Updated node value to ${editValue.trim()}.` });
  };

  // Delete Subtree
  const handleDeleteSubtree = () => {
    if (!selectedNode) return;
    pushHistory(tree);
    const updated = deleteNode(tree, selectedNode.id);
    setTree(updated);
    setSelectedNode(null);
    setConfirmDelete(false);
    setValidationMsg({ type: 'info', text: `Subtree at node ${selectedNode.value} deleted.` });
  };

  // Load Preset
  const handleLoadPreset = (preset) => {
    pushHistory(tree);
    const loaded = buildTreeFromLevelOrder(preset.levelOrder);
    setTree(loaded);
    setSelectedNode(null);
    setLevelOrderInput(preset.levelOrder.join(', '));
    setValidationMsg({ type: 'success', text: `Loaded preset: ${preset.name}` });
  };

  // Random Generator
  const handleGenerateRandom = (isBST = true) => {
    pushHistory(tree);
    const randomTree = generateRandomTree(7, isBST);
    setTree(randomTree);
    setSelectedNode(null);
    const serialized = treeToLevelOrder(randomTree);
    setLevelOrderInput(serialized.join(', '));
    setValidationMsg({
      type: 'success',
      text: `Generated random ${isBST ? 'Binary Search Tree' : 'Binary Tree'}!`,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-blue-400" />
            <span>Interactive Binary Tree Builder</span>
          </h2>
          <p className="text-sm text-slate-400">
            Construct trees via Level-Order (BFS) notation, or click any node on the canvas to add children, edit values, or prune subtrees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Undo last change"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo ({history.length})</span>
            </button>
          )}

          <button
            onClick={() => handleGenerateRandom(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition-all"
          >
            <Dices className="w-4 h-4" />
            <span>Random BST</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Simulate This Tree</span>
          </button>
        </div>
      </div>

      {/* Level-Order Input Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
        <form onSubmit={handleBuildFromInput} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Level-Order (BFS) Array Representation</span>
              <span className="text-slate-500 font-normal">
                (Use numbers or strings; use 'null' for skipped children)
              </span>
            </label>
            <span className="text-[11px] font-mono text-blue-400">
              Input format: 10, 5, 20, 3, 7, 15, 25
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={levelOrderInput}
                onChange={(e) => setLevelOrderInput(e.target.value)}
                placeholder="e.g. 10, 5, 20, 3, 7, 15, 25"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Build / Update Tree</span>
            </button>
          </div>

          {/* Validation / Status feedback bar */}
          <div
            className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${
              validationMsg.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : validationMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
            }`}
          >
            {validationMsg.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {validationMsg.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {validationMsg.type === 'info' && <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{validationMsg.text}</span>
          </div>
        </form>

        {/* Preset Buttons Grid */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2">Preset Quick-Loads:</div>
          <div className="flex flex-wrap gap-2">
            {PRESET_TREES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
            <button
              onClick={() => {
                pushHistory(tree);
                setTree(null);
                setSelectedNode(null);
                setLevelOrderInput('');
                setValidationMsg({ type: 'info', text: 'Tree cleared.' });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-950/30 hover:bg-red-900/40 text-red-300 border border-red-800/40 transition-colors"
            >
              Clear Tree
            </button>
          </div>
        </div>
      </div>

      {/* Main Builder Grid: Canvas & Node Editor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tree Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2 px-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Visual Workspace</span>
              <span>Click any node circle below to open child creation or subtree options</span>
            </div>
            <TreeVisualizer
              root={tree}
              selectedNodeId={selectedNode?.id}
              onNodeClick={handleNodeClick}
              height="480px"
              interactive={true}
            />
          </div>

          {/* Tree Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="glass-card rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Total Nodes (N)</div>
              <div className="text-xl font-bold text-white mt-1">{metrics.size}</div>
            </div>
            <div className="glass-card rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Height (H)</div>
              <div className="text-xl font-bold text-blue-400 mt-1">{metrics.height}</div>
            </div>
            <div className="glass-card rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Leaf Count</div>
              <div className="text-xl font-bold text-purple-400 mt-1">{metrics.leafCount}</div>
            </div>
            <div className="glass-card rounded-xl p-3 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Balanced?</div>
              <div className={`text-base font-bold mt-1.5 ${metrics.isBalanced ? 'text-emerald-400' : 'text-amber-400'}`}>
                {metrics.isBalanced ? 'Yes (AVL)' : 'No (Unbalanced)'}
              </div>
            </div>
            <div className="glass-card rounded-xl p-3 border border-slate-800 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-400 uppercase font-mono">Valid BST?</div>
              <div className={`text-base font-bold mt-1.5 ${metrics.isBST ? 'text-emerald-400' : 'text-slate-400'}`}>
                {metrics.isBST ? 'Yes (Sorted)' : 'General Tree'}
              </div>
            </div>
          </div>
        </div>

        {/* Node Inspection & Editing Side Panel */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Node Inspector</span>
              </h3>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Active selection banner */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
                  <div className="text-xs text-amber-300 font-mono">Selected Node Value</div>
                  <div className="text-2xl font-bold text-white font-mono mt-0.5">{selectedNode.value}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Children: Left: {selectedNode.hasLeft ? 'Yes' : 'None'} | Right: {selectedNode.hasRight ? 'Yes' : 'None'}
                  </div>
                </div>

                {/* Edit Value */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Edit Node Value</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleEditValue}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Add Left Child */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Add / Replace Left Child</span>
                    <span className="text-[10px] text-indigo-400">Left branch</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 12)"
                      value={newLeftValue}
                      onChange={(e) => setNewLeftValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAddLeft}
                      disabled={!newLeftValue.trim()}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Add Right Child */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Add / Replace Right Child</span>
                    <span className="text-[10px] text-purple-400">Right branch</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Value (e.g. 28)"
                      value={newRightValue}
                      onChange={(e) => setNewRightValue(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleAddRight}
                      disabled={!newRightValue.trim()}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete Subtree Action with Confirmation */}
                <div className="pt-3 border-t border-slate-800">
                  {confirmDelete ? (
                    <div className="space-y-2 bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl text-center">
                      <div className="text-xs text-red-300">
                        Delete node <strong>{selectedNode.value}</strong> and all its descendants?
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={handleDeleteSubtree}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="w-full py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/30 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Node & Subtree</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-slate-300">No Node Selected</div>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  Click on any node in the tree diagram to add left/right children or prune.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
