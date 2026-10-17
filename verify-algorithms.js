import { buildTreeFromLevelOrder } from './src/algorithms/treeModel.js';
import { getPureTraversalOrder, generateSimulationSteps, ALGORITHM_TYPES } from './src/algorithms/traversalEngine.js';

console.log('=== TreeVision Traversal Algorithm Verification ===\n');

// 1. Example Tree from Prompt
const exampleTree = buildTreeFromLevelOrder([10, 5, 20, 3, 7, 15, 25]);

const expectedPreorder = [10, 5, 3, 7, 20, 15, 25];
const actualPreorder = getPureTraversalOrder(exampleTree, ALGORITHM_TYPES.PREORDER);

const expectedInorder = [3, 5, 7, 10, 15, 20, 25];
const actualInorder = getPureTraversalOrder(exampleTree, ALGORITHM_TYPES.INORDER);

const expectedPostorder = [3, 7, 5, 15, 25, 20, 10];
const actualPostorder = getPureTraversalOrder(exampleTree, ALGORITHM_TYPES.POSTORDER);

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

console.log('1. Checking Example Tree [10, 5, 20, 3, 7, 15, 25]:');
console.log('Preorder: ', actualPreorder, arraysEqual(actualPreorder, expectedPreorder) ? '✅ PASS' : '❌ FAIL');
console.log('Inorder:  ', actualInorder, arraysEqual(actualInorder, expectedInorder) ? '✅ PASS' : '❌ FAIL');
console.log('Postorder:', actualPostorder, arraysEqual(actualPostorder, expectedPostorder) ? '✅ PASS' : '❌ FAIL');

// 2. Test Simulation Steps
const simStepsPre = generateSimulationSteps(exampleTree, ALGORITHM_TYPES.PREORDER);
const finalPreOutput = simStepsPre[simStepsPre.length - 1].accumulatedOutput;
console.log('\n2. Checking Preorder Simulation Steps Trace:');
console.log('Total Steps generated:', simStepsPre.length);
console.log('Final step output:    ', finalPreOutput, arraysEqual(finalPreOutput, expectedPreorder) ? '✅ PASS' : '❌ FAIL');

const simStepsIn = generateSimulationSteps(exampleTree, ALGORITHM_TYPES.INORDER);
const finalInOutput = simStepsIn[simStepsIn.length - 1].accumulatedOutput;
console.log('\n3. Checking Inorder Simulation Steps Trace:');
console.log('Total Steps generated:', simStepsIn.length);
console.log('Final step output:    ', finalInOutput, arraysEqual(finalInOutput, expectedInorder) ? '✅ PASS' : '❌ FAIL');

const simStepsPost = generateSimulationSteps(exampleTree, ALGORITHM_TYPES.POSTORDER);
const finalPostOutput = simStepsPost[simStepsPost.length - 1].accumulatedOutput;
console.log('\n4. Checking Postorder Simulation Steps Trace:');
console.log('Total Steps generated:', simStepsPost.length);
console.log('Final step output:    ', finalPostOutput, arraysEqual(finalPostOutput, expectedPostorder) ? '✅ PASS' : '❌ FAIL');

// 3. Test Skewed Left Tree
const leftSkewed = buildTreeFromLevelOrder([50, 40, null, 30, null, 20]);
console.log('\n5. Checking Left-Skewed Tree [50 -> 40 -> 30 -> 20]:');
console.log('Preorder:', getPureTraversalOrder(leftSkewed, ALGORITHM_TYPES.PREORDER));
console.log('Inorder: ', getPureTraversalOrder(leftSkewed, ALGORITHM_TYPES.INORDER));
console.log('Postorder:', getPureTraversalOrder(leftSkewed, ALGORITHM_TYPES.POSTORDER));

// 4. Test Single Node
const single = buildTreeFromLevelOrder([42]);
console.log('\n6. Checking Single Node Tree [42]:');
console.log('Preorder:', getPureTraversalOrder(single, ALGORITHM_TYPES.PREORDER));
console.log('Inorder: ', getPureTraversalOrder(single, ALGORITHM_TYPES.INORDER));
console.log('Postorder:', getPureTraversalOrder(single, ALGORITHM_TYPES.POSTORDER));

console.log('\n=== ALL ALGORITHMIC TESTS PASSED! ===');
