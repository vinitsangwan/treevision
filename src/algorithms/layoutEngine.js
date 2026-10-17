/**
 * Binary Tree Layout Engine
 * Calculates exact (x, y) coordinates for nodes and edge connectors.
 * Uses Inorder x-spacing with hierarchical parent centering for clean,
 * non-overlapping binary tree visualizations.
 */

export function calculateTreeLayout(root, options = {}) {
  if (!root) {
    return { nodes: [], edges: [], bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 } };
  }

  const {
    nodeRadius = 26,
    horizontalSpacing = 68,
    verticalSpacing = 82,
    padding = 40,
  } = options;

  let currentXIndex = 0;
  const nodeMap = new Map();

  // First pass: Inorder traversal to determine base x order
  function assignInorderX(node, depth = 0) {
    if (!node) return;

    assignInorderX(node.left, depth + 1);

    nodeMap.set(node.id, {
      id: node.id,
      value: node.value,
      depth,
      inorderX: currentXIndex++,
      rawNode: node,
    });

    assignInorderX(node.right, depth + 1);
  }

  assignInorderX(root, 0);

  // Second pass: Calculate coordinates with parent centering
  function calculatePositions(node) {
    if (!node) return null;

    const leftData = calculatePositions(node.left);
    const rightData = calculatePositions(node.right);
    const currentData = nodeMap.get(node.id);

    let x;
    if (leftData && rightData) {
      // Center above children
      x = (leftData.x + rightData.x) / 2;
    } else if (leftData) {
      // Offset slightly to the right of left child
      x = leftData.x + horizontalSpacing * 0.85;
    } else if (rightData) {
      // Offset slightly to the left of right child
      x = rightData.x - horizontalSpacing * 0.85;
    } else {
      // Leaf node uses its inorder position
      x = currentData.inorderX * horizontalSpacing;
    }

    const y = currentData.depth * verticalSpacing + padding;
    currentData.x = x;
    currentData.y = y;

    return currentData;
  }

  calculatePositions(root);

  // Collect all nodes and calculate bounding box
  const nodes = [];
  const edges = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // Third pass: Collect positioned nodes & generate edges
  function collectNodesAndEdges(node) {
    if (!node) return;

    const curr = nodeMap.get(node.id);
    nodes.push({
      id: curr.id,
      value: curr.value,
      x: curr.x,
      y: curr.y,
      depth: curr.depth,
      hasLeft: !!node.left,
      hasRight: !!node.right,
      leftId: node.left ? node.left.id : null,
      rightId: node.right ? node.right.id : null,
    });

    minX = Math.min(minX, curr.x);
    maxX = Math.max(maxX, curr.x);
    minY = Math.min(minY, curr.y);
    maxY = Math.max(maxY, curr.y);

    if (node.left) {
      const leftChild = nodeMap.get(node.left.id);
      edges.push({
        id: `edge_${node.id}_${node.left.id}`,
        fromId: node.id,
        toId: node.left.id,
        x1: curr.x,
        y1: curr.y,
        x2: leftChild.x,
        y2: leftChild.y,
        side: 'left',
      });
      collectNodesAndEdges(node.left);
    }

    if (node.right) {
      const rightChild = nodeMap.get(node.right.id);
      edges.push({
        id: `edge_${node.id}_${node.right.id}`,
        fromId: node.id,
        toId: node.right.id,
        x1: curr.x,
        y1: curr.y,
        x2: rightChild.x,
        y2: rightChild.y,
        side: 'right',
      });
      collectNodesAndEdges(node.right);
    }
  }

  collectNodesAndEdges(root);

  // Normalize coordinates so minX starts at padding
  const shiftX = padding - minX + nodeRadius;
  nodes.forEach(n => { n.x += shiftX; });
  edges.forEach(e => { e.x1 += shiftX; e.x2 += shiftX; });

  const totalWidth = Math.max(500, (maxX - minX) + padding * 2 + nodeRadius * 2);
  const totalHeight = Math.max(340, (maxY - minY) + padding * 2 + nodeRadius * 2);

  return {
    nodes,
    edges,
    bounds: {
      minX: 0,
      maxX: totalWidth,
      minY: 0,
      maxY: totalHeight,
      width: totalWidth,
      height: totalHeight,
    }
  };
}
