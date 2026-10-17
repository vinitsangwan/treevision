import React, { useMemo, useState, useRef } from 'react';
import { calculateTreeLayout } from '../algorithms/layoutEngine';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

export default function TreeVisualizer({
  root,
  activeNodeId = null,
  visitedNodeIds = [],
  activeEdge = null,
  selectedNodeId = null,
  onNodeClick = null,
  showNodeNumbers = true,
  visitedOrderMap = null,
  height = '500px',
  interactive = true,
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Compute layout with memoization
  const layout = useMemo(() => {
    return calculateTreeLayout(root, {
      nodeRadius: 26,
      horizontalSpacing: 74,
      verticalSpacing: 88,
      padding: 48,
    });
  }, [root]);

  // Visited set for O(1) lookups
  const visitedSet = useMemo(() => new Set(visitedNodeIds), [visitedNodeIds]);

  // Handle Pan Dragging
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle' || e.target.tagName === 'text') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Friendly Empty State
  if (!root || layout.nodes.length === 0) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 p-8 text-center transition-all"
        style={{ height }}
      >
        <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 text-blue-500 shadow-sm">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Your tree is waiting to grow 🌱</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
          Pick a quick preset like Balanced Tree above, or enter some numbers in the Tree Builder to watch the simulation come to life.
        </p>
      </div>
    );
  }

  const { width, height: boundsHeight } = layout.bounds;
  const viewBoxWidth = Math.max(640, width);
  const viewBoxHeight = Math.max(380, boundsHeight);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 shadow-xl select-none transition-colors"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Floating Canvas Controls (Friendly Pill) */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.15, 2.2))}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={resetView}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 px-1.5 border-l border-slate-200 dark:border-slate-800">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Active Node Glow Filter */}
          <filter id="active-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.85" />
          </filter>

          {/* Visited Node Glow Filter */}
          <filter id="visited-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#10b981" floodOpacity="0.6" />
          </filter>

          {/* Active Edge Glow */}
          <filter id="edge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.9" />
          </filter>

          {/* Gradients */}
          <linearGradient id="unvisited-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="visited-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <linearGradient id="selected-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transformOrigin: 'center' }}>
          {/* Smooth Curved Edges (Organic Branch Feel) */}
          {layout.edges.map(edge => {
            const isEdgeActive =
              activeEdge &&
              ((activeEdge.fromId === edge.fromId && activeEdge.toId === edge.toId) ||
               (activeEdge.toId === edge.fromId && activeEdge.fromId === edge.toId));

            const isEdgeVisited = visitedSet.has(edge.fromId) && visitedSet.has(edge.toId);
            const midY = (edge.y1 + edge.y2) / 2;
            const pathData = `M ${edge.x1} ${edge.y1} C ${edge.x1} ${midY}, ${edge.x2} ${midY}, ${edge.x2} ${edge.y2}`;

            return (
              <g key={edge.id}>
                {/* Edge line background shadow for depth */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="#020617"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d={pathData}
                  fill="none"
                  stroke={
                    isEdgeActive
                      ? '#c084fc'
                      : isEdgeVisited
                      ? '#10b981'
                      : '#334155'
                  }
                  strokeWidth={isEdgeActive ? '3.5' : '2.5'}
                  strokeDasharray={isEdgeActive ? '6 4' : 'none'}
                  strokeLinecap="round"
                  filter={isEdgeActive ? 'url(#edge-glow)' : 'none'}
                  className="transition-colors duration-300"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {layout.nodes.map(node => {
            const isActive = activeNodeId === node.id;
            const isVisited = visitedSet.has(node.id);
            const isSelected = selectedNodeId === node.id;

            // Determine badge order
            let orderNumber = null;
            if (visitedOrderMap && visitedOrderMap[node.id]) {
              orderNumber = visitedOrderMap[node.id];
            } else if (showNodeNumbers && visitedNodeIds.includes(node.id)) {
              orderNumber = visitedNodeIds.indexOf(node.id) + 1;
            }

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => interactive && onNodeClick && onNodeClick(node)}
                className={`transition-transform duration-200 ${
                  interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
                }`}
              >
                {/* Outer Ring on Active / Selected */}
                {isActive && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ animationDuration: '6s' }}
                  />
                )}

                {isSelected && !isActive && (
                  <circle
                    r="33"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="24"
                  fill={
                    isActive
                      ? 'url(#active-gradient)'
                      : isSelected
                      ? 'url(#selected-gradient)'
                      : isVisited
                      ? 'url(#visited-gradient)'
                      : 'url(#unvisited-gradient)'
                  }
                  stroke={
                    isActive
                      ? '#7dd3fc'
                      : isSelected
                      ? '#fcd34d'
                      : isVisited
                      ? '#6ee7b7'
                      : '#475569'
                  }
                  strokeWidth={isActive || isSelected ? '2.5' : '2'}
                  filter={isActive ? 'url(#active-glow)' : isVisited ? 'url(#visited-glow)' : 'none'}
                  className="transition-all duration-300"
                />

                {/* Node Value Label */}
                <text
                  textAnchor="middle"
                  dy=".35em"
                  fill={isActive || isVisited || isSelected ? '#ffffff' : '#e2e8f0'}
                  fontWeight="600"
                  fontSize={String(node.value).length > 3 ? '12px' : '14px'}
                  className={`font-mono pointer-events-none select-none ${
                    isActive || isVisited || isSelected ? 'node-value-text-active' : 'node-value-text'
                  }`}
                >
                  {node.value}
                </text>

                {/* Step / Visit Order Badge */}
                {orderNumber !== null && (
                  <g transform="translate(18, -18)">
                    <circle r="11" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dy=".35em"
                      fill="#34d399"
                      fontWeight="700"
                      fontSize="10px"
                      className="font-mono pointer-events-none"
                    >
                      {orderNumber}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Modern Friendly Floating Legend */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center justify-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-lg shadow-black/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 inline-block" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 inline-block" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 inline-block" />
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-purple-400 rounded-full inline-block" />
          <span>Active Path</span>
        </div>
      </div>
    </div>
  );
}
