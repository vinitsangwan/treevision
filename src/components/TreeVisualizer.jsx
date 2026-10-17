import React, { useMemo, useState, useRef } from 'react';
import { calculateTreeLayout } from '../algorithms/layoutEngine';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Info } from 'lucide-react';

export default function TreeVisualizer({
  root,
  activeNodeId = null,
  visitedNodeIds = [],
  activeEdge = null,
  selectedNodeId = null,
  onNodeClick = null,
  showNodeNumbers = true,
  visitedOrderMap = null, // Map of nodeId -> visitation order number (1, 2, 3...)
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

  if (!root || layout.nodes.length === 0) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 text-slate-400 p-8 text-center"
        style={{ height }}
      >
        <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 text-slate-500">
          <Info className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-semibold text-slate-200">Binary Tree is Empty</h4>
        <p className="text-sm text-slate-400 max-w-sm mt-1">
          Use the Tree Builder or select a preset example (e.g. Balanced Tree) to begin the simulation.
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
      className="relative w-full rounded-2xl overflow-hidden bg-slate-950/70 border border-slate-800/80 shadow-2xl select-none"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Visual Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.15, 2.2))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="text-xs font-mono text-slate-400 px-1 border-l border-slate-700">
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
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.9" />
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
          {/* Edges */}
          {layout.edges.map(edge => {
            const isEdgeActive =
              activeEdge &&
              ((activeEdge.fromId === edge.fromId && activeEdge.toId === edge.toId) ||
               (activeEdge.toId === edge.fromId && activeEdge.fromId === edge.toId));

            const isEdgeVisited = visitedSet.has(edge.fromId) && visitedSet.has(edge.toId);

            return (
              <g key={edge.id}>
                {/* Edge line background shadow for depth */}
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#020617"
                  strokeWidth="5"
                />
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={
                    isEdgeActive
                      ? '#c084fc'
                      : isEdgeVisited
                      ? '#10b981'
                      : '#334155'
                  }
                  strokeWidth={isEdgeActive ? '3.5' : '2.5'}
                  strokeDasharray={isEdgeActive ? '6 3' : 'none'}
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
                  interactive ? 'cursor-pointer hover:scale-110' : ''
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

      {/* Modern Legend */}
      <div className="absolute bottom-3 left-4 z-10 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 inline-block" />
          <span>Active / Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 inline-block" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500 inline-block" />
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-purple-400 rounded inline-block" />
          <span>Active Edge</span>
        </div>
      </div>
    </div>
  );
}
