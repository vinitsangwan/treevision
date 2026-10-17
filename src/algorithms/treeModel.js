/**
 * Binary Tree Data Structure & Operations for TreeVision
 */

let idCounter = 1;
export const generateNodeId = (prefix = 'node') => {
  return `${prefix}_${Date.now()}_${idCounter++}`;
};

export class TreeNode {
  constructor(value, id = null) {
    this.value = value;
    this.id = id || generateNodeId();
    this.left = null;
    this.right = null;
  }
}

/**
 * Deep clone a binary tree maintaining IDs and structure
 */
export function cloneTree(root) {
  if (!root) return null;
  const newNode = new TreeNode(root.value, root.id);
  newNode.left = cloneTree(root.left);
  newNode.right = cloneTree(root.right);
  return newNode;
}

/**
 * Build a binary tree from level-order representation.
 * Supports numbers, strings, and "null"/"None"/"#" for missing children.
 * Example inputs: "10, 5, 20, 3, 7, 15, 25" or [10, 5, 20, null, 7]
 */
export function buildTreeFromLevelOrder(input) {
  if (!input) return null;

  let values = [];
  if (Array.isArray(input)) {
    values = [...input];
  } else if (typeof input === 'string') {
    // Split by commas, whitespace or brackets
    const cleanStr = input.replace(/[\[\]]/g, '').trim();
    if (!cleanStr) return null;
    values = cleanStr.split(/[\s,]+/).filter(v => v !== '');
  }

  if (values.length === 0) return null;

  const parseVal = (val) => {
    if (val === null || val === undefined) return null;
    const str = String(val).trim().toLowerCase();
    if (str === 'null' || str === 'none' || str === '#' || str === '-' || str === '') {
      return null;
    }
    const num = Number(val);
    return isNaN(num) ? String(val).trim() : num;
  };

  const firstVal = parseVal(values[0]);
  if (firstVal === null) return null;

  const root = new TreeNode(firstVal);
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const current = queue.shift();

    // Process Left Child
    if (i < values.length) {
      const leftVal = parseVal(values[i]);
      if (leftVal !== null) {
        current.left = new TreeNode(leftVal);
        queue.push(current.left);
      }
      i++;
    }

    // Process Right Child
    if (i < values.length) {
      const rightVal = parseVal(values[i]);
      if (rightVal !== null) {
        current.right = new TreeNode(rightVal);
        queue.push(current.right);
      }
      i++;
    }
  }

  return root;
}

/**
 * Serialize tree to level order array of values
 */
export function treeToLevelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node) {
      result.push(node.value);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }

  // Trim trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

/**
 * Find node by ID
 */
export function findNodeById(root, id) {
  if (!root || !id) return null;
  if (root.id === id) return root;
  return findNodeById(root.left, id) || findNodeById(root.right, id);
}

/**
 * Find parent node by child ID
 */
export function findParentNode(root, childId) {
  if (!root || !childId || root.id === childId) return null;

  if ((root.left && root.left.id === childId) || (root.right && root.right.id === childId)) {
    return root;
  }

  return findParentNode(root.left, childId) || findParentNode(root.right, childId);
}

/**
 * Insert child node (left or right)
 */
export function insertChild(root, parentId, value, side = 'left') {
  if (!root) return null;
  const newTree = cloneTree(root);
  const parent = findNodeById(newTree, parentId);
  if (!parent) return newTree;

  const newNode = new TreeNode(value);
  if (side === 'left') {
    parent.left = newNode;
  } else {
    parent.right = newNode;
  }

  return newTree;
}

/**
 * Update value of a specific node
 */
export function updateNodeValue(root, nodeId, newValue) {
  if (!root) return null;
  const newTree = cloneTree(root);
  const node = findNodeById(newTree, nodeId);
  if (node) {
    const num = Number(newValue);
    node.value = isNaN(num) ? String(newValue).trim() : num;
  }
  return newTree;
}

/**
 * Delete a node and its entire subtree
 */
export function deleteNode(root, nodeId) {
  if (!root) return null;
  if (root.id === nodeId) return null; // Root deleted -> empty tree

  const newTree = cloneTree(root);
  const parent = findParentNode(newTree, nodeId);
  if (parent) {
    if (parent.left && parent.left.id === nodeId) {
      parent.left = null;
    } else if (parent.right && parent.right.id === nodeId) {
      parent.right = null;
    }
  }
  return newTree;
}

/**
 * Calculate tree metrics
 */
export function calculateTreeMetrics(root) {
  if (!root) {
    return {
      size: 0,
      height: 0,
      leafCount: 0,
      isBalanced: true,
      isBST: true,
    };
  }

  let size = 0;
  let leafCount = 0;

  function getHeight(node) {
    if (!node) return 0;
    size++;
    if (!node.left && !node.right) leafCount++;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }

  const height = getHeight(root);

  // Check balanced
  function checkBalance(node) {
    if (!node) return 0;
    const lh = checkBalance(node.left);
    if (lh === -1) return -1;
    const rh = checkBalance(node.right);
    if (rh === -1) return -1;
    if (Math.abs(lh - rh) > 1) return -1;
    return 1 + Math.max(lh, rh);
  }
  const isBalanced = checkBalance(root) !== -1;

  // Check BST property (assuming numeric values)
  function checkBST(node, min = -Infinity, max = Infinity) {
    if (!node) return true;
    const val = typeof node.value === 'number' ? node.value : Number(node.value);
    if (isNaN(val)) return false;
    if (val <= min || val >= max) return false;
    return checkBST(node.left, min, val) && checkBST(node.right, val, max);
  }
  const isBST = checkBST(root);

  return {
    size,
    height,
    leafCount,
    isBalanced,
    isBST,
  };
}

/**
 * Generate a random binary tree with 5-8 nodes
 */
export function generateRandomTree(numNodes = 6, isBST = true) {
  if (numNodes <= 0) return null;

  // Generate unique random numbers
  const set = new Set();
  while (set.size < numNodes) {
    set.add(Math.floor(Math.random() * 90) + 10);
  }
  const values = Array.from(set);

  if (isBST) {
    // Insert into BST
    let root = new TreeNode(values[0]);
    for (let i = 1; i < values.length; i++) {
      const val = values[i];
      let curr = root;
      while (true) {
        if (val < curr.value) {
          if (!curr.left) {
            curr.left = new TreeNode(val);
            break;
          }
          curr = curr.left;
        } else {
          if (!curr.right) {
            curr.right = new TreeNode(val);
            break;
          }
          curr = curr.right;
        }
      }
    }
    return root;
  } else {
    // General binary tree via level order
    return buildTreeFromLevelOrder(values);
  }
}
