export class MinHeap {
    constructor(scoreFunction) {
        this.heap = [];
        this.scoreFunction = scoreFunction;
    }

    push(node) {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(n) {
        const element = this.heap[n];
        const score = this.scoreFunction(element);
        while (n > 0) {
            const parentN = Math.floor((n + 1) / 2) - 1;
            const parent = this.heap[parentN];
            if (score >= this.scoreFunction(parent)) break;
            this.heap[parentN] = element;
            this.heap[n] = parent;
            n = parentN;
        }
    }

    sinkDown(n) {
        const length = this.heap.length;
        const element = this.heap[n];
        const score = this.scoreFunction(element);

        while (true) {
            const child2N = (n + 1) * 2;
            const child1N = child2N - 1;
            let swap = null;

            if (child1N < length) {
                const child1 = this.heap[child1N];
                if (this.scoreFunction(child1) < score) {
                    swap = child1N;
                }
            }

            if (child2N < length) {
                const child2 = this.heap[child2N];
                const child2Score = this.scoreFunction(child2);
                if (swap === null) {
                    if (child2Score < score) swap = child2N;
                } else {
                    if (child2Score < this.scoreFunction(this.heap[swap])) swap = child2N;
                }
            }

            if (swap === null) break;

            this.heap[n] = this.heap[swap];
            this.heap[swap] = element;
            n = swap;
        }
    }

    // Optional: Check if node exists and update it (often O(N) in simple heap, or O(1) with hash map map)
    // For A*, if we just add duplicates and process visited, it's often faster than maintaining the update.
    // We will just verify 'visited' status on pop.
}
