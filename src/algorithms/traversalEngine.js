/**
 * Binary Tree Traversal Simulation Engine
 * Generates deterministic step-by-step traces for Preorder, Inorder, and Postorder traversals.
 * Tracks node visitation, recursion call stack, active edges, pseudocode line highlight, and educational explanations.
 */

export const ALGORITHM_TYPES = {
  PREORDER: 'PREORDER',
  INORDER: 'INORDER',
  POSTORDER: 'POSTORDER',
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
 * Generates an educational step-by-step simulation trace
 */
export function generateSimulationSteps(root, algorithm = ALGORITHM_TYPES.PREORDER) {
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
    });
  }

  function getChildInfo(node) {
    const leftText = node.left ? `Node(${node.left.value})` : 'null (empty)';
    const rightText = node.right ? `Node(${node.right.value})` : 'null (empty)';
    return { leftText, rightText };
  }

  // PREORDER SIMULATION GENERATOR
  function simulatePreorder(node, parent = null) {
    if (!node) {
      return;
    }

    const { leftText, rightText } = getChildInfo(node);
    const stackFrame = {
      name: `preorder(${node.value})`,
      nodeId: node.id,
      value: node.value,
      phase: 'Visiting root',
    };
    callStack.push(stackFrame);

    // Step: Visit current node
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

    // Step: Recurse left
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

    // Step: Recurse right
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

    // Returning from call
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
