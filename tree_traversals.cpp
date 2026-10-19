/**
 * ============================================================================
 * Project: TreeVision — Binary Tree Traversal Simulator (C++ Implementation)
 * Subject: Data Structures and Algorithms (DSA) Mini Project
 * 
 * Description:
 * Standard C++ implementation of a Binary Tree with:
 * 1. Dynamic Node Creation (Pointers & Struct)
 * 2. Level-Order (BFS) Tree Construction using std::queue
 * 3. Preorder Traversal  (Root -> Left -> Right) - O(N) time, O(H) space
 * 4. Inorder Traversal   (Left -> Root -> Right) - O(N) time, O(H) space
 * 5. Postorder Traversal (Left -> Right -> Root) - O(N) time, O(H) space
 * ============================================================================
 */

#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <sstream>

using namespace std;

// Definition of a Binary Tree Node
struct Node {
    int data;
    Node* left;
    Node* right;

    // Constructor
    Node(int val) {
        data = val;
        left = nullptr;
        right = nullptr;
    }
};

/**
 * 1. PREORDER TRAVERSAL
 * Algorithm:
 *  - Visit current node (Root)
 *  - Recursively traverse left subtree
 *  - Recursively traverse right subtree
 */
void preorder(Node* root) {
    if (root == nullptr) {
        return;
    }
    cout << root->data << " "; // 1. Visit Root
    preorder(root->left);      // 2. Explore Left
    preorder(root->right);     // 3. Explore Right
}

/**
 * 2. INORDER TRAVERSAL
 * Algorithm:
 *  - Recursively traverse left subtree
 *  - Visit current node (Root)
 *  - Recursively traverse right subtree
 * Note: For a Binary Search Tree (BST), this visits values in ascending sorted order.
 */
void inorder(Node* root) {
    if (root == nullptr) {
        return;
    }
    inorder(root->left);       // 1. Explore Left
    cout << root->data << " "; // 2. Visit Root
    inorder(root->right);      // 3. Explore Right
}

/**
 * 3. POSTORDER TRAVERSAL
 * Algorithm:
 *  - Recursively traverse left subtree
 *  - Recursively traverse right subtree
 *  - Visit current node (Root)
 * Note: Ideal for bottom-up operations like node deletion/memory cleanup.
 */
void postorder(Node* root) {
    if (root == nullptr) {
        return;
    }
    postorder(root->left);     // 1. Explore Left
    postorder(root->right);    // 2. Explore Right
    cout << root->data << " "; // 3. Visit Root
}

/**
 * Helper to build a binary tree from level-order input values.
 * Uses -1 to represent null / empty children.
 * Example: {10, 5, 20, 3, 7, 15, 25}
 */
Node* buildTreeFromLevelOrder(const vector<int>& values) {
    if (values.empty() || values[0] == -1) {
        return nullptr;
    }

    Node* root = new Node(values[0]);
    queue<Node*> q;
    q.push(root);

    size_t i = 1;
    while (!q.empty() && i < values.size()) {
        Node* current = q.front();
        q.pop();

        // Process Left Child
        if (i < values.size()) {
            if (values[i] != -1) {
                current->left = new Node(values[i]);
                q.push(current->left);
            }
            i++;
        }

        // Process Right Child
        if (i < values.size()) {
            if (values[i] != -1) {
                current->right = new Node(values[i]);
                q.push(current->right);
            }
            i++;
        }
    }

    return root;
}

/**
 * Helper function to calculate tree height
 */
int calculateHeight(Node* root) {
    if (root == nullptr) return 0;
    return 1 + max(calculateHeight(root->left), calculateHeight(root->right));
}

/**
 * Helper function to free allocated tree memory (Postorder deletion)
 */
void freeTree(Node* root) {
    if (root == nullptr) return;
    freeTree(root->left);
    freeTree(root->right);
    delete root;
}

int main() {
    cout << "=======================================================\n";
    cout << "  TreeVision — Binary Tree Traversal Simulator (C++)\n";
    cout << "=======================================================\n\n";

    // Standard demonstration tree:
    //         10
    //        /  \
    //       5    20
    //      / \   / \
    //     3   7 15 25
    vector<int> sampleInput = {10, 5, 20, 3, 7, 15, 25};

    cout << "Building tree from Level-Order input: ";
    for (int val : sampleInput) {
        cout << val << " ";
    }
    cout << "\n\n";

    Node* root = buildTreeFromLevelOrder(sampleInput);

    cout << "Tree Height: " << calculateHeight(root) << " levels\n\n";

    cout << "-------------------------------------------------------\n";
    cout << "1. Preorder Traversal  (Root -> Left -> Right):\n   ";
    preorder(root);
    cout << "\n   Expected: 10 5 3 7 20 15 25\n\n";

    cout << "2. Inorder Traversal   (Left -> Root -> Right):\n   ";
    inorder(root);
    cout << "\n   Expected: 3 5 7 10 15 20 25  (Sorted for BST)\n\n";

    cout << "3. Postorder Traversal (Left -> Right -> Root):\n   ";
    postorder(root);
    cout << "\n   Expected: 3 7 5 15 25 20 10\n";
    cout << "-------------------------------------------------------\n\n";

    // Memory cleanup
    freeTree(root);
    cout << "Tree memory safely deallocated.\n";

    return 0;
}
