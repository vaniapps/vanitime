class Node {
    constructor(element) {
      this.element = element;
      this.left = null;
      this.right = null;
    }
  }

class MaxHeap {
    constructor() {
      this.heap = [];
    }
  
    insert(element) {
      this.heap.push(element);
      this.bubbleUp(this.heap.length - 1);
    }
  
    bubbleUp(index) {
      const parentIndex = Math.floor((index - 1) / 2);
  
      if (parentIndex >= 0 && this.heap[index].element.priority > this.heap[parentIndex].element.priority) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        this.bubbleUp(parentIndex);
      }
    }
  
    extractMax() {
      if (this.heap.length === 0) return null;
  
      const max = this.heap[0];
      const lastElement = this.heap.pop();
  
      if (this.heap.length > 0) {
        this.heap[0] = lastElement;
        this.bubbleDown(0);
      }
  
      return max.element;
    }
  
    bubbleDown(index) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let largestIndex = index;
  
      if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].element.priority > this.heap[largestIndex].element.priority) {
        largestIndex = leftChildIndex;
      }
  
      if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].element.priority > this.heap[largestIndex].element.priority) {
        largestIndex = rightChildIndex;
      }
  
      if (largestIndex !== index) {
        [this.heap[index], this.heap[largestIndex]] = [this.heap[largestIndex], this.heap[index]];
        this.bubbleDown(largestIndex);
      }
    }
  
    size() {
      return this.heap.length;
    }
  }
  
  class MaxPriorityDataStructure {
    constructor() {
      this.bstRoot = null;
      this.maxHeap = new MaxHeap();
    }
  
    insert(element) {
      const newNode = new Node(element);
      this.bstRoot = this.insertIntoBST(this.bstRoot, newNode);
      this.maxHeap.insert(newNode);
    }
  
    insertIntoBST(root, newNode) {
      if (root === null) return newNode;
  
      if (newNode.element.priority > root.element.priority) {
        root.left = this.insertIntoBST(root.left, newNode);
      } else {
        root.right = this.insertIntoBST(root.right, newNode);
      }
  
      return root;
    }
  
    remove(priority) {
      this.bstRoot = this.removeFromBST(this.bstRoot, priority);
      this.maxHeap = this.rebuildHeap();
    }
  
    removeFromBST(root, priority) {
      if (root === null) return null;
  
      if (priority > root.element.priority) {
        root.left = this.removeFromBST(root.left, priority);
      } else if (priority < root.element.priority) {
        root.right = this.removeFromBST(root.right, priority);
      } else {
        if (root.left === null) return root.right;
        if (root.right === null) return root.left;
  
        const maxValueNode = this.findMaxValueNode(root.left);
        root.element = maxValueNode.element;
        root.left = this.removeFromBST(root.left, maxValueNode.element.priority);
      }
  
      return root;
    }
  
    findMaxValueNode(node) {
      while (node.right !== null) {
        node = node.right;
      }
      return node;
    }
  
    rebuildHeap() {
      const newHeap = new MaxHeap();
  
      const inorderTraversal = (node) => {
        if (node !== null) {
          inorderTraversal(node.left);
          newHeap.insert(node);
          inorderTraversal(node.right);
        }
      };
  
      inorderTraversal(this.bstRoot);
      return newHeap;
    }
  
    getMax() {
      return this.maxHeap.heap[0].element;
    }
  
    size() {
      return this.maxHeap.size();
    }
  }

  export default MaxPriorityDataStructure
  