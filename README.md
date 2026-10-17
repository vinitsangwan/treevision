# TreeVision — Binary Tree Traversal Simulator

> **"See the Algorithm. Understand the Tree."**  
> An interactive binary tree visualization and traversal simulation web application.

![TreeVision](https://img.shields.io/badge/TreeVision-Traversal%20Simulator-blue?style=for-the-badge&logo=react)
![Vercel Ready](https://img.shields.io/badge/Vercel-Ready%20to%20Deploy-black?style=for-the-badge&logo=vercel)
![Status](https://img.shields.io/badge/Status-100%25%20Functional%20%26%20Offline-emerald?style=for-the-badge)

---

## 🌟 Modules & Features

1. **Home**:
   - Hero introduction, live interactive SVG binary tree preview, and core algorithm feature cards.
   - Comprehensive comparison between Preorder, Inorder, and Postorder.

2. **Interactive Tree Builder**:
   - **Level-Order Input**: Accepts comma-separated values (e.g. `10, 5, 20, 3, 7, 15, 25`) and generates the tree via BFS.
   - **Node-Click Inspector**: Click any node on the canvas to add left/right children, edit values, or delete subtrees.
   - **Presets**: Balanced Tree, Left-Skewed, Right-Skewed, Expression Tree, 15-node Deep Tree, and Empty Tree.
   - **Random Tree Generator**: Generates random binary search trees.
   - **Live Tree Metrics**: Node count, tree height, leaf count, AVL balance status, and BST verification.
   - **Undo**: History stack for easy reversion of accidental changes.

3. **Traversal Simulator**:
   - Step-by-step animation of **Preorder**, **Inorder**, and **Postorder** traversals.
   - Real-time recursion call stack inspector (frames pushed & popped).
   - Synchronous pseudocode line highlighter.
   - Play, Pause, Next Step, Previous Step, Restart, and Speed Slider ($0.2\text{x}$ to $2.0\text{x}$).
   - Keyboard shortcuts (`Space`: Play/Pause, `→`: Next, `←`: Prev, `R`: Restart).
   - Copy traversal results to clipboard or download full execution logs as `.txt`.

4. **Compare All**:
   - Displays Preorder, Inorder, and Postorder side by side on the exact same tree.
   - Numbered order badges ($1..N$) overlaid directly on nodes.
   - Traversal matrix comparing visiting order rules and root positions.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deploy to Vercel

```bash
npx vercel
```
Or push to GitHub and import the repository into [vercel.com](https://vercel.com).
The included `vercel.json` automatically handles routing rewrites and Vite build settings.
