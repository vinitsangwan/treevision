/**
 * Preset Binary Trees for Demonstrations
 */

export const PRESET_TREES = [
  {
    id: 'balanced',
    name: 'Balanced Tree (Default)',
    description: 'Perfect 3-level binary search tree. Ideal for comparing Inorder vs Preorder vs Postorder.',
    levelOrder: [10, 5, 20, 3, 7, 15, 25],
    preview: '10 -> (5, 20) -> (3, 7, 15, 25)',
  },
  {
    id: 'left_skewed',
    name: 'Left-Skewed Tree',
    description: 'Degenerate tree leaning purely left like a linked list. Demonstrates O(n) height and worst-case call stack.',
    levelOrder: [50, 40, null, 30, null, 20, null, 10],
    preview: '50 -> 40 -> 30 -> 20 -> 10',
  },
  {
    id: 'right_skewed',
    name: 'Right-Skewed Tree',
    description: 'Degenerate tree leaning purely right. Highlights linear traversal stack and non-branching behavior.',
    levelOrder: [10, null, 20, null, 30, null, 40, null, 50],
    preview: '10 -> 20 -> 30 -> 40 -> 50',
  },
  {
    id: 'expression_tree',
    name: 'Expression Tree',
    description: 'Models arithmetic evaluation: (A + B) * (C - D). Highlights infix, prefix, and postfix representations.',
    levelOrder: ['*', '+', '-', 'A', 'B', 'C', 'D'],
    preview: '* -> (+, -) -> (A, B, C, D)',
  },
  {
    id: 'deep_balanced',
    name: 'Deep Balanced Tree (15 Nodes)',
    description: 'A 4-level full binary tree showing rich branch exploration and recursion unwinding.',
    levelOrder: [40, 20, 60, 10, 30, 50, 70, 5, 15, 25, 35, 45, 55, 65, 75],
    preview: '4-level full BST with 15 nodes',
  },
  {
    id: 'zigzag',
    name: 'Zig-Zag Tree',
    description: 'Alternates left and right subtrees at each level.',
    levelOrder: [10, 5, null, null, 8, 6, null, null, 7],
    preview: 'Alternating branches',
  },
  {
    id: 'single_node',
    name: 'Single Node Tree',
    description: 'Edge case: single root node with no children.',
    levelOrder: [42],
    preview: 'Root node 42 only',
  },
  {
    id: 'empty',
    name: 'Empty Tree',
    description: 'Base case: 0 nodes. Tests empty-state handling.',
    levelOrder: [],
    preview: 'Empty (null)',
  },
];
