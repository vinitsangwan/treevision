/**
 * Binary Tree Traversal & Operation Simulation Engine
 * Generates deterministic step-by-step traces for:
 * 1. Preorder Traversal (Root -> Left -> Right)
 * 2. Inorder Traversal (Left -> Root -> Right)
 * 3. Postorder Traversal (Left -> Right -> Root)
 * 4. BST Insertion (Search Path -> Leaf Placement)
 * 5. BST Deletion (Search Path -> 3 Cases: Leaf, 1 Child, 2 Children with Inorder Successor)
 */

import { TreeNode, cloneTree } from './treeModel';

export const ALGORITHM_TYPES = {
  PREORDER: 'PREORDER',
  INORDER: 'INORDER',
  POSTORDER: 'POSTORDER',
  INSERT: 'INSERT',
  DELETE: 'DELETE',
};

export const ALGORITHM_METADATA = {
  PREORDER: {
    name: 'Preorder Traversal',
    order: 'Root → Left → Right',
    pseudocode: [
      { line: 1, text: 'function preorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    visit(node)  // 1. Process Root' },
      { line: 4, text: '    preorder(node.left)  // 2. Recurse Left' },
      { line: 5, text: '    preorder(node.right) // 3. Recurse Right' },
    ],
    description: 'Processes the current node first, then deeply explores the left subtree before the right subtree.',
    useCases: ['Cloning/copying binary trees', 'Prefix expression trees (Polish notation)', 'Directory hierarchy serialization'],
  },
  INORDER: {
    name: 'Inorder Traversal',
    order: 'Left → Root → Right',
    pseudocode: [
      { line: 1, text: 'function inorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    inorder(node.left)   // 1. Recurse Left' },
      { line: 4, text: '    visit(node)  // 2. Process Root' },
      { line: 5, text: '    inorder(node.right)  // 3. Recurse Right' },
    ],
    description: 'Explores the left subtree completely, visits the current node, then traverses the right subtree. Produces sorted order for BSTs.',
    useCases: ['Binary Search Tree (BST) sorted sequence', 'Arithmetic expression trees (Infix notation)', 'Validation of BST property'],
  },
  POSTORDER: {
    name: 'Postorder Traversal',
    order: 'Left → Right → Root',
    pseudocode: [
      { line: 1, text: 'function postorder(node):' },
      { line: 2, text: '    if node is null: return' },
      { line: 3, text: '    postorder(node.left)  // 1. Recurse Left' },
      { line: 4, text: '    postorder(node.right) // 2. Recurse Right' },
      { line: 5, text: '    visit(node)  // 3. Process Root' },
    ],
    description: 'Explores both left and right subtrees completely before visiting the current node.',
    useCases: ['Deleting or freeing tree nodes (bottom-up)', 'Postfix expression evaluation (Reverse Polish)', 'Calculating directory folder sizes'],
  },
  INSERT: {
    name: 'BST Node Insertion',
    order: 'Compare Values → Place at Empty Branch',
    pseudocode: [
      { line: 1, text: 'function insert(node, val):' },
      { line: 2, text: '    if node is null: return new Node(val)' },
      { line: 3, text: '    if val < node.val:' },
      { line: 4, text: '        node.left = insert(node.left, val)' },
      { line: 5, text: '    else if val > node.val:' },
      { line: 6, text: '        node.right = insert(node.right, val)' },
      { line: 7, text: '    return node' },
    ],
    description: 'Follows the binary search property (go left if smaller, go right if larger) until an empty spot is reached to attach the new node.',
    useCases: ['Building dynamic search trees', 'Maintaining sorted data collections', 'Database index updates'],
  },
  DELETE: {
    name: 'BST Node Deletion',
    order: 'Find Node → Handle 3 Cases (0, 1, or 2 children)',
    pseudocode: [
      { line: 1, text: 'function delete(node, val):' },
      { line: 2, text: '    if node is null: return null' },
      { line: 3, text: '    if val < node.val: node.left = delete(node.left, val)' },
      { line: 4, text: '    else if val > node.val: node.right = delete(node.right, val)' },
      { line: 5, text: '    else: // Node found!' },
      { line: 6, text: '        if no children: return null' },
      { line: 7, text: '        if 1 child: return child' },
      { line: 8, text: '        replace with Inorder Successor; delete successor' },
    ],
    description: 'Locates target value, then handles 3 cases: leaf node (delete), 1 child (promote child), or 2 children (replace with inorder successor).',
    useCases: ['Removing records from search trees', 'Garbage collection in binary structures', 'Dynamic index rebalancing'],
  },
};

/**
 * Pure recursive traversals returning array of values
 */
export function getPureTraversalOrder(root, algorithm = ALGORITHM_TYPES.INORDER) {
  if (!root) return [];
  const result = [];

  function traverse(node) {
    if (!node) return;
    if (algorithm === ALGORITHM_TYPES.PREORDER) {
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    } else if (algorithm === ALGORITHM_TYPES.INORDER) {
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    } else if (algorithm === ALGORITHM_TYPES.POSTORDER) {
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    }
  }

  traverse(root);
  return result;
}

/**
 * BST Insertion Simulation Trace Generator
 */
export function simulateBstInsertion(root, targetValue) {
  const steps = [];
  const valNum = Number(targetValue);
  if (isNaN(valNum)) return [];

  let currentTree = cloneTree(root);
  const visitedNodeIds = [];
  const pathValues = [];
  const callStack = [];

  function recordStep({
    type,
    nodeId = null,
    nodeValue = null,
    activeEdge = null,
    pseudocodeLine = 1,
    action = '',
    explanation = '',
    treeSnapshot = currentTree,
  }) {
    steps.push({
      stepNumber: steps.length + 1,
      type,
      activeNodeId: nodeId,
      activeNodeValue: nodeValue,
      visitedNodeIds: [...visitedNodeIds],
      accumulatedOutput: [...pathValues],
      activeEdge,
      callStack: callStack.map(f => ({ ...f })),
      pseudocodeLine,
      action,
      explanation,
      leftInfo: nodeId ? 'Checking' : 'None',
      rightInfo: nodeId ? 'Checking' : 'None',
      treeSnapshot: cloneTree(treeSnapshot),
    });
  }

  // Case 0: Empty tree
  if (!currentTree) {
    const newRoot = new TreeNode(valNum);
    recordStep({
      type: 'INSERT',
      nodeId: newRoot.id,
      nodeValue: newRoot.value,
      pseudocodeLine: 2,
      action: `Create Root Node [ ${valNum} ]`,
      explanation: `Tree was empty. Created new root node with value ${valNum}.`,
      treeSnapshot: newRoot,
    });
    return steps;
  }

  // Walk down BST
  let curr = currentTree;
  let parent = null;

  while (curr) {
    visitedNodeIds.push(curr.id);
    pathValues.push(curr.value);
    callStack.push({
      name: `insert(${curr.value}, ${valNum})`,
      nodeId: curr.id,
      value: curr.value,
      phase: `Comparing ${valNum} with ${curr.value}`,
    });

    if (valNum === curr.value) {
      recordStep({
        type: 'DUPLICATE',
        nodeId: curr.id,
        nodeValue: curr.value,
        activeEdge: parent ? { fromId: parent.id, toId: curr.id } : null,
        pseudocodeLine: 7,
        action: `Value [ ${valNum} ] Already Exists`,
        explanation: `Node ${curr.value} already contains value ${valNum}. Binary Search Trees hold unique keys, so no new node is inserted.`,
        treeSnapshot: currentTree,
      });
      return steps;
    } else if (valNum < curr.value) {
      recordStep({
        type: 'COMPARE',
        nodeId: curr.id,
        nodeValue: curr.value,
        activeEdge: parent ? { fromId: parent.id, toId: curr.id } : null,
        pseudocodeLine: 3,
        action: `Compare: ${valNum} < ${curr.value}`,
        explanation: `${valNum} is smaller than ${curr.value}. Moving to the LEFT branch.`,
        treeSnapshot: currentTree,
      });

      if (!curr.left) {
        // Place new node as left child
        const newNode = new TreeNode(valNum);
        curr.left = newNode;
        visitedNodeIds.push(newNode.id);
        pathValues.push(newNode.value);

        recordStep({
          type: 'INSERT',
          nodeId: newNode.id,
          nodeValue: newNode.value,
          activeEdge: { fromId: curr.id, toId: newNode.id },
          pseudocodeLine: 4,
          action: `Insert Node [ ${valNum} ] as Left Child`,
          explanation: `Found an empty left pointer at node ${curr.value}. Linked new node [ ${valNum} ] as its left child!`,
          treeSnapshot: currentTree,
        });

        recordStep({
          type: 'COMPLETE',
          nodeId: newNode.id,
          nodeValue: newNode.value,
          pseudocodeLine: 7,
          action: `Insertion Complete!`,
          explanation: `Node [ ${valNum} ] successfully inserted. The BST invariant (left < root < right) is fully preserved.`,
          treeSnapshot: currentTree,
        });
        return steps;
      }

      parent = curr;
      curr = curr.left;
    } else {
      // valNum > curr.value
      recordStep({
        type: 'COMPARE',
        nodeId: curr.id,
        nodeValue: curr.value,
        activeEdge: parent ? { fromId: parent.id, toId: curr.id } : null,
        pseudocodeLine: 5,
        action: `Compare: ${valNum} > ${curr.value}`,
        explanation: `${valNum} is larger than ${curr.value}. Moving to the RIGHT branch.`,
        treeSnapshot: currentTree,
      });

      if (!curr.right) {
        // Place new node as right child
        const newNode = new TreeNode(valNum);
        curr.right = newNode;
        visitedNodeIds.push(newNode.id);
        pathValues.push(newNode.value);

        recordStep({
          type: 'INSERT',
          nodeId: newNode.id,
          nodeValue: newNode.value,
          activeEdge: { fromId: curr.id, toId: newNode.id },
          pseudocodeLine: 6,
          action: `Insert Node [ ${valNum} ] as Right Child`,
          explanation: `Found an empty right pointer at node ${curr.value}. Linked new node [ ${valNum} ] as its right child!`,
          treeSnapshot: currentTree,
        });

        recordStep({
          type: 'COMPLETE',
          nodeId: newNode.id,
          nodeValue: newNode.value,
          pseudocodeLine: 7,
          action: `Insertion Complete!`,
          explanation: `Node [ ${valNum} ] successfully inserted. The BST invariant (left < root < right) is fully preserved.`,
          treeSnapshot: currentTree,
        });
        return steps;
      }

      parent = curr;
      curr = curr.right;
    }
  }

  return steps;
}

/**
 * BST Deletion Simulation Trace Generator
 */
export function simulateBstDeletion(root, targetValue) {
  const steps = [];
  const valNum = Number(targetValue);
  if (isNaN(valNum) || !root) return [];

  let currentTree = cloneTree(root);
  const visitedNodeIds = [];
  const pathValues = [];
  const callStack = [];

  function recordStep({
    type,
    nodeId = null,
    nodeValue = null,
    activeEdge = null,
    pseudocodeLine = 1,
    action = '',
    explanation = '',
    treeSnapshot = currentTree,
  }) {
    steps.push({
      stepNumber: steps.length + 1,
      type,
      activeNodeId: nodeId,
      activeNodeValue: nodeValue,
      visitedNodeIds: [...visitedNodeIds],
      accumulatedOutput: [...pathValues],
      activeEdge,
      callStack: callStack.map(f => ({ ...f })),
      pseudocodeLine,
      action,
      explanation,
      leftInfo: 'Checking',
      rightInfo: 'Checking',
      treeSnapshot: cloneTree(treeSnapshot),
    });
  }

  // 1. Search for target node
  let curr = currentTree;
  let parent = null;
  let side = null;

  while (curr && curr.value !== valNum) {
    visitedNodeIds.push(curr.id);
    pathValues.push(curr.value);
    callStack.push({
      name: `delete(${curr.value}, ${valNum})`,
      nodeId: curr.id,
      value: curr.value,
      phase: `Searching for ${valNum}`,
    });

    if (valNum < curr.value) {
      recordStep({
        type: 'SEARCH',
        nodeId: curr.id,
        nodeValue: curr.value,
        activeEdge: parent ? { fromId: parent.id, toId: curr.id } : null,
        pseudocodeLine: 3,
        action: `Search: ${valNum} < ${curr.value}`,
        explanation: `Target ${valNum} is smaller than ${curr.value}. Searching down the LEFT subtree.`,
        treeSnapshot: currentTree,
      });
      parent = curr;
      side = 'left';
      curr = curr.left;
    } else {
      recordStep({
        type: 'SEARCH',
        nodeId: curr.id,
        nodeValue: curr.value,
        activeEdge: parent ? { fromId: parent.id, toId: curr.id } : null,
        pseudocodeLine: 4,
        action: `Search: ${valNum} > ${curr.value}`,
        explanation: `Target ${valNum} is larger than ${curr.value}. Searching down the RIGHT subtree.`,
        treeSnapshot: currentTree,
      });
      parent = curr;
      side = 'right';
      curr = curr.right;
    }
  }

  // Node not found
  if (!curr) {
    recordStep({
      type: 'NOT_FOUND',
      nodeId: null,
      nodeValue: null,
      pseudocodeLine: 2,
      action: `Node [ ${valNum} ] Not Found`,
      explanation: `Reached a null pointer. Node ${valNum} does not exist in this binary search tree.`,
      treeSnapshot: currentTree,
    });
    return steps;
  }

  // Node Found!
  visitedNodeIds.push(curr.id);
  pathValues.push(curr.value);

  // CASE 1: Leaf node (0 children)
  if (!curr.left && !curr.right) {
    recordStep({
      type: 'CASE_1',
      nodeId: curr.id,
      nodeValue: curr.value,
      pseudocodeLine: 6,
      action: `Found Leaf Node [ ${curr.value} ] (Case 1)`,
      explanation: `Node ${curr.value} has 0 children (Leaf node). It can be directly unlinked from its parent.`,
      treeSnapshot: currentTree,
    });

    if (!parent) {
      currentTree = null; // Root deleted
    } else {
      if (side === 'left') parent.left = null;
      else parent.right = null;
    }

    recordStep({
      type: 'COMPLETE',
      nodeId: null,
      nodeValue: null,
      pseudocodeLine: 6,
      action: `Leaf Node [ ${valNum} ] Deleted!`,
      explanation: `Successfully unlinked leaf node ${valNum}. Parent pointer set to null.`,
      treeSnapshot: currentTree,
    });
    return steps;
  }

  // CASE 2: Exactly 1 child
  if (!curr.left || !curr.right) {
    const child = curr.left || curr.right;
    const childSide = curr.left ? 'left' : 'right';

    recordStep({
      type: 'CASE_2',
      nodeId: curr.id,
      nodeValue: curr.value,
      activeEdge: { fromId: curr.id, toId: child.id },
      pseudocodeLine: 7,
      action: `Found Node [ ${curr.value} ] with 1 Child (Case 2)`,
      explanation: `Node ${curr.value} has only one child (Node ${child.value} on ${childSide}). We can bypass node ${curr.value} and promote its child directly.`,
      treeSnapshot: currentTree,
    });

    if (!parent) {
      currentTree = child;
    } else {
      if (side === 'left') parent.left = child;
      else parent.right = child;
    }

    recordStep({
      type: 'COMPLETE',
      nodeId: child.id,
      nodeValue: child.value,
      pseudocodeLine: 7,
      action: `Node [ ${valNum} ] Bypassed & Deleted!`,
      explanation: `Successfully deleted node ${valNum}. Child [ ${child.value} ] is now directly connected to parent.`,
      treeSnapshot: currentTree,
    });
    return steps;
  }

  // CASE 3: Node with 2 children (Find Inorder Successor)
  recordStep({
    type: 'CASE_3',
    nodeId: curr.id,
    nodeValue: curr.value,
    pseudocodeLine: 8,
    action: `Found Node [ ${curr.value} ] with 2 Children (Case 3)`,
    explanation: `Node ${curr.value} has both left and right children. We must find its Inorder Successor (the smallest node in its right subtree) to replace it.`,
    treeSnapshot: currentTree,
  });

  let succParent = curr;
  let succ = curr.right;
  recordStep({
    type: 'FIND_SUCCESSOR',
    nodeId: succ.id,
    nodeValue: succ.value,
    activeEdge: { fromId: curr.id, toId: succ.id },
    pseudocodeLine: 8,
    action: `Enter Right Subtree: Node [ ${succ.value} ]`,
    explanation: `Starting search for inorder successor at the root of right subtree (Node ${succ.value}).`,
    treeSnapshot: currentTree,
  });

  while (succ.left) {
    succParent = succ;
    succ = succ.left;
    recordStep({
      type: 'FIND_SUCCESSOR',
      nodeId: succ.id,
      nodeValue: succ.value,
      activeEdge: { fromId: succParent.id, toId: succ.id },
      pseudocodeLine: 8,
      action: `Follow Left Branch: Node [ ${succ.value} ]`,
      explanation: `Traversing left to find minimum value in the right subtree.`,
      treeSnapshot: currentTree,
    });
  }

  // Found successor!
  recordStep({
    type: 'SUCCESSOR_FOUND',
    nodeId: succ.id,
    nodeValue: succ.value,
    pseudocodeLine: 8,
    action: `Inorder Successor Found: [ ${succ.value} ]`,
    explanation: `Node ${succ.value} is the minimum value in right subtree. We will copy value ${succ.value} into target node ${curr.value}.`,
    treeSnapshot: currentTree,
  });

  // Copy successor value
  curr.value = succ.value;
  recordStep({
    type: 'REPLACE_VALUE',
    nodeId: curr.id,
    nodeValue: curr.value,
    pseudocodeLine: 8,
    action: `Copied Value [ ${succ.value} ] into Target Node`,
    explanation: `Target node value updated to ${succ.value}. Now unlinking the duplicate successor node from right subtree.`,
    treeSnapshot: currentTree,
  });

  // Unlink original successor
  if (succParent === curr) {
    succParent.right = succ.right;
  } else {
    succParent.left = succ.right;
  }

  recordStep({
    type: 'COMPLETE',
    nodeId: curr.id,
    nodeValue: curr.value,
    pseudocodeLine: 8,
    action: `Deletion of [ ${valNum} ] Complete!`,
    explanation: `Original successor node unlinked. Node ${curr.value} is now in position, preserving all BST ordering constraints.`,
    treeSnapshot: currentTree,
  });

  return steps;
}

/**
 * Generates an educational step-by-step simulation trace
 */
export function generateSimulationSteps(root, algorithm = ALGORITHM_TYPES.PREORDER, targetValue = null) {
  if (algorithm === ALGORITHM_TYPES.INSERT) {
    return simulateBstInsertion(root, targetValue);
  }

  if (algorithm === ALGORITHM_TYPES.DELETE) {
    return simulateBstDeletion(root, targetValue);
  }

  if (!root) return [];

  const steps = [];
  const visitedNodeIds = [];
  const visitedValues = [];
  const callStack = [];

  function recordStep({
    type = 'STEP',
    nodeId = null,
    nodeValue = null,
    activeEdge = null,
    pseudocodeLine = 1,
    action = '',
    explanation = '',
    leftInfo = 'None',
    rightInfo = 'None',
  }) {
    steps.push({
      stepNumber: steps.length + 1,
      type,
      activeNodeId: nodeId,
      activeNodeValue: nodeValue,
      visitedNodeIds: [...visitedNodeIds],
      accumulatedOutput: [...visitedValues],
      activeEdge,
      callStack: callStack.map(frame => ({ ...frame })),
      pseudocodeLine,
      action,
      explanation,
      leftInfo,
      rightInfo,
      treeSnapshot: root, // Traversals don't mutate structure
    });
  }

  function getChildInfo(node) {
    const leftText = node.left ? `Node(${node.left.value})` : 'null (empty)';
    const rightText = node.right ? `Node(${node.right.value})` : 'null (empty)';
    return { leftText, rightText };
  }

  // PREORDER SIMULATION GENERATOR
  function simulatePreorder(node, parent = null) {
    if (!node) return;

    const { leftText, rightText } = getChildInfo(node);
    const stackFrame = {
      name: `preorder(${node.value})`,
      nodeId: node.id,
      value: node.value,
      phase: 'Visiting root',
    };
    callStack.push(stackFrame);

    // Visit current node
    visitedNodeIds.push(node.id);
    visitedValues.push(node.value);

    recordStep({
      type: 'VISIT',
      nodeId: node.id,
      nodeValue: node.value,
      activeEdge: parent ? { fromId: parent.id, toId: node.id } : null,
      pseudocodeLine: 3,
      action: `Visit node [ ${node.value} ]`,
      explanation: `Preorder visits ROOT first. Node ${node.value} is appended to the traversal sequence.`,
      leftInfo: leftText,
      rightInfo: rightText,
    });

    // Recurse left
    if (node.left) {
      stackFrame.phase = 'Recursing Left subtree';
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.left.id },
        pseudocodeLine: 4,
        action: `Traverse Left -> Node [ ${node.left.value} ]`,
        explanation: `Calling preorder(node.left) to traverse left subtree rooted at ${node.left.value}.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulatePreorder(node.left, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Left child of [ ${node.value} ] is null`,
        explanation: `Left child is null. The base condition 'if node is null return' triggers for left branch.`,
        leftInfo: 'null',
        rightInfo: rightText,
      });
    }

    // Recurse right
    if (node.right) {
      stackFrame.phase = 'Recursing Right subtree';
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.right.id },
        pseudocodeLine: 5,
        action: `Traverse Right -> Node [ ${node.right.value} ]`,
        explanation: `Calling preorder(node.right) to traverse right subtree rooted at ${node.right.value}.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulatePreorder(node.right, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Right child of [ ${node.value} ] is null`,
        explanation: `Right child is null. The base condition 'if node is null return' triggers for right branch.`,
        leftInfo: leftText,
        rightInfo: 'null',
      });
    }

    callStack.pop();
  }

  // INORDER SIMULATION GENERATOR
  function simulateInorder(node, parent = null) {
    if (!node) return;

    const { leftText, rightText } = getChildInfo(node);
    const stackFrame = {
      name: `inorder(${node.value})`,
      nodeId: node.id,
      value: node.value,
      phase: 'Exploring Left',
    };
    callStack.push(stackFrame);

    // Recurse left
    if (node.left) {
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.left.id },
        pseudocodeLine: 3,
        action: `Traverse Left -> Node [ ${node.left.value} ]`,
        explanation: `Inorder visits LEFT first. Traversing left subtree before processing node ${node.value}.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulateInorder(node.left, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Left child of [ ${node.value} ] is null`,
        explanation: `Node ${node.value} has no left child (or left traversal returned). Ready to visit node ${node.value}.`,
        leftInfo: 'null',
        rightInfo: rightText,
      });
    }

    // Visit current node
    visitedNodeIds.push(node.id);
    visitedValues.push(node.value);
    stackFrame.phase = 'Visiting Root';

    recordStep({
      type: 'VISIT',
      nodeId: node.id,
      nodeValue: node.value,
      pseudocodeLine: 4,
      action: `Visit node [ ${node.value} ]`,
      explanation: `Left subtree is processed. Now visiting node ${node.value} and adding it to output.`,
      leftInfo: leftText,
      rightInfo: rightText,
    });

    // Recurse right
    if (node.right) {
      stackFrame.phase = 'Recursing Right subtree';
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.right.id },
        pseudocodeLine: 5,
        action: `Traverse Right -> Node [ ${node.right.value} ]`,
        explanation: `Calling inorder(node.right) to traverse right subtree rooted at ${node.right.value}.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulateInorder(node.right, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Right child of [ ${node.value} ] is null`,
        explanation: `Right child is null. Finished subtree rooted at ${node.value}. Returning up call stack.`,
        leftInfo: leftText,
        rightInfo: 'null',
      });
    }

    callStack.pop();
  }

  // POSTORDER SIMULATION GENERATOR
  function simulatePostorder(node, parent = null) {
    if (!node) return;

    const { leftText, rightText } = getChildInfo(node);
    const stackFrame = {
      name: `postorder(${node.value})`,
      nodeId: node.id,
      value: node.value,
      phase: 'Exploring Left',
    };
    callStack.push(stackFrame);

    // Recurse left
    if (node.left) {
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.left.id },
        pseudocodeLine: 3,
        action: `Traverse Left -> Node [ ${node.left.value} ]`,
        explanation: `Postorder processes LEFT and RIGHT before ROOT. Traversing left subtree.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulatePostorder(node.left, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Left child of [ ${node.value} ] is null`,
        explanation: `Node ${node.value} has no left child. Moving to right subtree.`,
        leftInfo: 'null',
        rightInfo: rightText,
      });
    }

    // Recurse right
    if (node.right) {
      stackFrame.phase = 'Exploring Right';
      recordStep({
        type: 'TRAVERSE',
        nodeId: node.id,
        nodeValue: node.value,
        activeEdge: { fromId: node.id, toId: node.right.id },
        pseudocodeLine: 4,
        action: `Traverse Right -> Node [ ${node.right.value} ]`,
        explanation: `Traversing right subtree of node ${node.value} before root is visited.`,
        leftInfo: leftText,
        rightInfo: rightText,
      });
      simulatePostorder(node.right, node);
    } else {
      recordStep({
        type: 'NULL_CHECK',
        nodeId: node.id,
        nodeValue: node.value,
        pseudocodeLine: 2,
        action: `Right child of [ ${node.value} ] is null`,
        explanation: `Right subtree of ${node.value} is empty or complete. Both subtrees are now finished.`,
        leftInfo: leftText,
        rightInfo: 'null',
      });
    }

    // Visit current node
    visitedNodeIds.push(node.id);
    visitedValues.push(node.value);
    stackFrame.phase = 'Visiting Root';

    recordStep({
      type: 'VISIT',
      nodeId: node.id,
      nodeValue: node.value,
      pseudocodeLine: 5,
      action: `Visit node [ ${node.value} ]`,
      explanation: `Both left and right subtrees are finished. Node ${node.value} is now visited and added to output.`,
      leftInfo: leftText,
      rightInfo: rightText,
    });

    callStack.pop();
  }

  if (algorithm === ALGORITHM_TYPES.PREORDER) {
    simulatePreorder(root);
  } else if (algorithm === ALGORITHM_TYPES.INORDER) {
    simulateInorder(root);
  } else if (algorithm === ALGORITHM_TYPES.POSTORDER) {
    simulatePostorder(root);
  }

  // Final summary completion step
  if (steps.length > 0) {
    recordStep({
      type: 'COMPLETE',
      nodeId: null,
      nodeValue: null,
      pseudocodeLine: 1,
      action: `Traversal Complete!`,
      explanation: `All ${visitedValues.length} nodes visited in ${ALGORITHM_METADATA[algorithm].name}. Final sequence: [ ${visitedValues.join(', ')} ].`,
      leftInfo: 'Done',
      rightInfo: 'Done',
    });
  }

  return steps;
}
