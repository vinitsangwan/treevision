import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Gauge,
  Copy,
  Download,
  Check,
  Code2,
  Layers,
  Sparkles,
  Info,
  Hash,
  Keyboard,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  CornerDownRight,
} from 'lucide-react';
import TreeVisualizer from '../components/TreeVisualizer';
import {
  ALGORITHM_TYPES,
  ALGORITHM_METADATA,
  generateSimulationSteps,
  getPureTraversalOrder,
} from '../algorithms/traversalEngine';
import { cloneTree } from '../algorithms/treeModel';

export default function SimulatorView({
  tree,
  setTree,
  setActiveTab,
}) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHM_TYPES.PREORDER);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState(900); // 300ms to 2000ms
  const [showNodeNumbers, setShowNodeNumbers] = useState(true);
  const [copied, setCopied] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  // Playback timer reference
  const timerRef = useRef(null);

  // All existing node values from current tree in sorted order
  const existingValues = useMemo(() => {
    return getPureTraversalOrder(tree, ALGORITHM_TYPES.INORDER);
  }, [tree]);

  // Suggested values for insertion that don't already exist in the tree
  const suggestedInsertValues = useMemo(() => {
    const existing = new Set(existingValues);
    const candidates = [12, 18, 8, 28, 4, 16, 22, 35, 2, 9];
    return candidates.filter((val) => !existing.has(val)).slice(0, 4);
  }, [existingValues]);

  // Target value for BST Insert / Delete operations
  const [targetValue, setTargetValue] = useState(() => {
    if (existingValues.length > 0) {
      return existingValues[Math.floor(existingValues.length / 2)];
    }
    return 12;
  });
  const [inputVal, setInputVal] = useState('12');

  const isOperation =
    selectedAlgorithm === ALGORITHM_TYPES.INSERT ||
    selectedAlgorithm === ALGORITHM_TYPES.DELETE;

  // Generate deterministic simulation steps for current tree and algorithm
  const steps = useMemo(() => {
    return generateSimulationSteps(tree, selectedAlgorithm, targetValue);
  }, [tree, selectedAlgorithm, targetValue]);

  // Safe clamp of current step index
  const safeStepIndex = Math.min(currentStepIndex, Math.max(0, steps.length - 1));

  // Current active step
  const currentStep = steps[safeStepIndex] || {
    stepNumber: 0,
    activeNodeId: null,
    activeNodeValue: null,
    visitedNodeIds: [],
    accumulatedOutput: [],
    activeEdge: null,
    callStack: [],
    pseudocodeLine: 1,
    action: 'Ready to start simulation',
    explanation: 'Select an algorithm or operation and press Play or Next Step to begin.',
    leftInfo: 'None',
    rightInfo: 'None',
    treeSnapshot: tree,
  };

  // Safe Step Navigation Handlers
  const handleNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [steps.length]);

  const handlePrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleRestart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Algorithm Switch Handler
  const handleAlgorithmChange = (algo) => {
    setIsPlaying(false);
    setSelectedAlgorithm(algo);
    setCurrentStepIndex(0);

    if (algo === ALGORITHM_TYPES.INSERT) {
      const candidate = suggestedInsertValues[0] ?? 12;
      setTargetValue(candidate);
      setInputVal(String(candidate));
    } else if (algo === ALGORITHM_TYPES.DELETE) {
      const defaultVal =
        existingValues.length > 0
          ? existingValues[Math.floor(existingValues.length / 2)]
          : 10;
      setTargetValue(defaultVal);
      setInputVal(String(defaultVal));
    }
  };

  // Automated Playback Loop
  useEffect(() => {
    if (isPlaying) {
      if (safeStepIndex >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      timerRef.current = setTimeout(() => {
        handleNextStep();
      }, playbackSpeedMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, safeStepIndex, steps.length, playbackSpeedMs, handleNextStep]);

  // Keyboard Shortcuts (Space: Play/Pause, ArrowRight: Next, ArrowLeft: Prev, R: Restart)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        handleNextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        handlePrevStep();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextStep, handlePrevStep, handleRestart]);

  // Copy Traversal / Operation Output
  const handleCopyOutput = () => {
    const text = currentStep.accumulatedOutput.join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Apply simulated changes permanently to the tree in App.jsx
  const handleApplyToTree = () => {
    if (setTree && currentStep.treeSnapshot) {
      setTree(cloneTree(currentStep.treeSnapshot));
      setAppliedFeedback(true);
      setTimeout(() => setAppliedFeedback(false), 2500);
    }
  };

  // Download Results as TXT
  const handleDownloadResults = () => {
    const finalStep = steps[steps.length - 1] || currentStep;
    const content = `TreeVision — Binary Tree Simulator Results
======================================================
Algorithm: ${ALGORITHM_METADATA[selectedAlgorithm].name}
${isOperation ? `Target Value: ${targetValue}` : `Traversal Strategy: ${ALGORITHM_METADATA[selectedAlgorithm].order}`}
${isOperation ? `Path Evaluated: [ ${finalStep.accumulatedOutput.join(' -> ')} ]` : `Generated Order: [ ${finalStep.accumulatedOutput.join(', ')} ]`}
Total Simulation Steps: ${steps.length}
Final Step Action: ${finalStep.action}

Step-by-Step Execution Log:
------------------------------------------------------
${steps
  .map(
    (s) =>
      `Step ${s.stepNumber}: [${s.action}] -> ${s.explanation}`
  )
  .join('\n')}

======================================================
Generated by TreeVision DSA Educational Suite
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `treevision_${selectedAlgorithm.toLowerCase()}_results.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentMeta = ALGORITHM_METADATA[selectedAlgorithm];
  const isSimulationFinished = safeStepIndex >= steps.length - 1 && steps.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Algorithm Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {isOperation ? 'Tree Operations Simulator' : 'Traversal Simulator'}
            </h2>
            <span className="text-[11px] px-3 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-semibold">
              Live Walkthrough
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
            Step through traversals, node insertion, and deletions one operation at a time.
          </p>
        </div>

        {/* Algorithm Tabs (Human-crafted neutral segmented pills) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-zinc-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <div className="hidden sm:flex items-center pr-2 mr-1 border-r border-slate-200 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider pl-1.5">
            Traversals
          </div>
          {[
            { id: ALGORITHM_TYPES.PREORDER, label: 'Preorder' },
            { id: ALGORITHM_TYPES.INORDER, label: 'Inorder' },
            { id: ALGORITHM_TYPES.POSTORDER, label: 'Postorder' },
          ].map((algo) => (
            <button
              key={algo.id}
              onClick={() => handleAlgorithmChange(algo.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedAlgorithm === algo.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              {algo.label}
            </button>
          ))}

          <div className="hidden sm:flex items-center px-2 mx-1 border-x border-slate-200 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            Operations
          </div>
          {[
            { id: ALGORITHM_TYPES.INSERT, label: 'Insert (BST)', icon: Plus },
            { id: ALGORITHM_TYPES.DELETE, label: 'Delete (BST)', icon: Trash2 },
          ].map((algo) => {
            const Icon = algo.icon;
            return (
              <button
                key={algo.id}
                onClick={() => handleAlgorithmChange(algo.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedAlgorithm === algo.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{algo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Operation Configuration Bar (Only visible when Insert or Delete is selected) */}
      {isOperation && (
        <div className="glass-panel rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60 dark:bg-zinc-900/40">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              {selectedAlgorithm === ALGORITHM_TYPES.INSERT ? (
                <>
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Value to Insert:</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Node to Delete:</span>
                </>
              )}
            </span>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = Number(inputVal);
                if (!isNaN(val)) {
                  setTargetValue(val);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Value"
                className="w-24 px-3 py-1.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-600"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
              >
                {selectedAlgorithm === ALGORITHM_TYPES.INSERT ? 'Run Insert' : 'Run Delete'}
              </button>
            </form>
          </div>

          {/* Quick Preset Value Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-zinc-400 text-[11px] mr-1">
              {selectedAlgorithm === ALGORITHM_TYPES.INSERT ? 'Try inserting:' : 'Or pick node:'}
            </span>
            {selectedAlgorithm === ALGORITHM_TYPES.INSERT ? (
              suggestedInsertValues.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setInputVal(String(val));
                    setTargetValue(val);
                    setCurrentStepIndex(0);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-medium border transition-all ${
                    targetValue === val
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                      : 'bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-400'
                  }`}
                >
                  +{val}
                </button>
              ))
            ) : (
              existingValues.slice(0, 8).map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setInputVal(String(val));
                    setTargetValue(val);
                    setCurrentStepIndex(0);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs font-medium border transition-all ${
                    targetValue === val
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:border-slate-400'
                  }`}
                >
                  {val}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Visualizer + Algorithm Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left/Center: Visualizer and Playback Controls */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visualizer Container */}
          <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-zinc-800 shadow-xl relative">
            {/* Header info strip above tree */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-zinc-200">{currentMeta.name}</span>
                <span className="text-slate-400 dark:text-zinc-500 font-mono">({currentMeta.order})</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <button
                  onClick={() => setShowNodeNumbers(!showNodeNumbers)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    showNodeNumbers
                      ? 'bg-slate-200/80 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-300'
                  }`}
                  title="Toggle visitation / comparison order badges"
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Show Step Badges</span>
                </button>
                <div className="text-slate-500 dark:text-zinc-400">
                  Step: <strong className="text-slate-900 dark:text-white font-bold">{safeStepIndex + 1}</strong> / {steps.length || 1}
                </div>
              </div>
            </div>

            {/* Tree Canvas */}
            <TreeVisualizer
              root={currentStep.treeSnapshot !== undefined ? currentStep.treeSnapshot : tree}
              activeNodeId={currentStep.activeNodeId}
              visitedNodeIds={currentStep.visitedNodeIds}
              activeEdge={currentStep.activeEdge}
              showNodeNumbers={showNodeNumbers}
              height="430px"
              interactive={true}
              onNodeClick={(node) => {
                if (selectedAlgorithm === ALGORITHM_TYPES.DELETE) {
                  setInputVal(String(node.value));
                  setTargetValue(node.value);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }
              }}
            />

            {/* Current Action / Explanation Banner */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{currentStep.action}</span>
                    {currentStep.activeNodeValue !== null && currentStep.activeNodeValue !== undefined && (
                      <span className="font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-[11px] font-bold">
                        Node {currentStep.activeNodeValue}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{currentStep.explanation}</p>
                </div>
              </div>

              {/* If simulation reached completion for Insert / Delete, allow applying changes */}
              {isOperation && isSimulationFinished && setTree && currentStep.treeSnapshot && (
                <div className="shrink-0 pl-2">
                  <button
                    onClick={handleApplyToTree}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                    title="Permanently save this modified tree structure to your active session"
                  >
                    {appliedFeedback ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Apply to Tree</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Simulation Controls Bar */}
          <div className="glass-panel rounded-3xl p-3.5 sm:p-4 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            {/* Playback Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestart}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Restart (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevStep}
                disabled={safeStepIndex === 0}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-700 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Previous Step (Left Arrow)"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-sm hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                }`}
                title="Play / Pause (Space)"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Walkthrough'}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={safeStepIndex >= steps.length - 1}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-700 dark:text-zinc-300 transition-all hover:scale-105 active:scale-95"
                title="Next Step (Right Arrow)"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Animation Speed Slider */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                <Gauge className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
                <span className="hidden sm:inline">Speed:</span>
              </div>
              <input
                type="range"
                min="200"
                max="1800"
                step="100"
                value={2000 - playbackSpeedMs}
                onChange={(e) => setPlaybackSpeedMs(2000 - Number(e.target.value))}
                className="w-24 sm:w-32 accent-slate-900 dark:accent-white cursor-pointer"
                title="Adjust animation playback delay"
              />
              <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 w-12 text-right">
                {((2000 - playbackSpeedMs) / 1000).toFixed(1)}x
              </span>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Space: Play | ← / →: Step | R: Reset</span>
            </div>
          </div>

          {/* Accumulated Output Ribbon / Decision Path */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5">
                <span>
                  {isOperation
                    ? `Search Comparison Path (${currentStep.accumulatedOutput.length} nodes checked):`
                    : `Output Sequence Accumulated So Far (${currentStep.accumulatedOutput.length} nodes visited):`}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyOutput}
                  disabled={currentStep.accumulatedOutput.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 disabled:opacity-40 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadResults}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>

            <div className="min-h-[48px] bg-white dark:bg-zinc-950 rounded-xl p-3 border border-slate-200 dark:border-zinc-800 flex flex-wrap items-center gap-2 font-mono">
              {currentStep.accumulatedOutput.length > 0 ? (
                currentStep.accumulatedOutput.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white text-xs font-bold animate-fadeIn"
                  >
                    <span>{val}</span>
                    {idx < currentStep.accumulatedOutput.length - 1 && (
                      <span className="text-slate-400 font-normal">
                        {isOperation ? '→' : ','}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 dark:text-zinc-500 italic">
                  {isOperation
                    ? 'Start simulation to trace the BST comparison path.'
                    : 'Simulation has not visited any nodes yet. Click Next or Play!'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Algorithm Execution Details, Call Stack, & Pseudocode (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Algorithm Info & Line Highlight */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
                <span>Algorithm Pseudocode</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                Line {currentStep.pseudocodeLine}
              </span>
            </div>

            {/* Pseudocode Box */}
            <div className="bg-slate-50 dark:bg-zinc-950 rounded-xl p-3 font-mono text-xs border border-slate-200 dark:border-zinc-800 space-y-1">
              {currentMeta.pseudocode.map((line) => {
                const isLineActive = currentStep.pseudocodeLine === line.line;
                return (
                  <div
                    key={line.line}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      isLineActive
                        ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="text-slate-400 dark:text-zinc-600 select-none mr-2 w-4 inline-block text-right">
                      {line.line}
                    </span>
                    <span>{line.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Current Recursive Context Details */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Current Node:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentStep.activeNodeValue !== null && currentStep.activeNodeValue !== undefined
                    ? `Node(${currentStep.activeNodeValue})`
                    : 'null / none'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Left Child:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300">{currentStep.leftInfo}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-zinc-400">Right Child:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300">{currentStep.rightInfo}</span>
              </div>
            </div>
          </div>

          {/* Call Stack Visualizer */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700 dark:text-zinc-300" />
                <span>Call Stack & Frames</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                Depth: {currentStep.callStack?.length || 0}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Active stack frames pushed during recursive calls. The topmost frame is currently executing.
            </p>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {currentStep.callStack && currentStep.callStack.length > 0 ? (
                [...currentStep.callStack].reverse().map((frame, index) => {
                  const isTop = index === 0;
                  return (
                    <div
                      key={index}
                      className={`p-2.5 rounded-xl border text-xs font-mono transition-all ${
                        isTop
                          ? 'bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600 text-slate-900 dark:text-white shadow-sm'
                          : 'bg-white dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{frame.name}</span>
                        {isTop && (
                          <span className="text-[10px] uppercase font-bold text-slate-700 dark:text-zinc-300 bg-slate-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
                            Top
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3" />
                        <span>Phase: {frame.phase}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 dark:text-zinc-500 text-xs italic">
                  Stack is empty (no active recursive frames)
                </div>
              )}
            </div>
          </div>

          {/* Complexity Summary Card */}
          <div className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 text-xs space-y-2">
            <div className="font-semibold text-slate-900 dark:text-zinc-200">
              {isOperation ? 'Operation Complexity' : 'Complexity Metrics:'}
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-zinc-800/80">
              <span className="text-slate-500 dark:text-zinc-400">Time Complexity:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {isOperation ? 'O(H)' : 'O(N)'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-zinc-800/80">
              <span className="text-slate-500 dark:text-zinc-400">Auxiliary Stack Space:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-zinc-300">
                O(H)
              </span>
            </div>
            {isOperation && (
              <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-zinc-800/80">
                <span className="text-slate-500 dark:text-zinc-400">Average / Skewed:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-300">
                  O(log N) / O(N)
                </span>
              </div>
            )}
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 pt-1 leading-normal">
              {isOperation
                ? 'H = height of tree. For balanced trees H = O(log N). For degenerate skewed trees H = O(N).'
                : 'Where N = number of nodes, and H = tree height. For balanced trees H = O(log N).'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
