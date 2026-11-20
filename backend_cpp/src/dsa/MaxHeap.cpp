#include "../../include/dsa/MaxHeap.h"
#include "../../include/services/PostService.h"
#include <stdexcept>
#include <utility>

template <typename T>
MaxHeap<T>::MaxHeap() {}

template <typename T>
void MaxHeap<T>::heapifyUp(int i) {
    while (i > 0) {
        int p = (i - 1) / 2;
        if (heap[i] > heap[p]) {
            std::swap(heap[i], heap[p]);
            i = p;
        } else break;
    }
}

template <typename T>
void MaxHeap<T>::heapifyDown(int i) {
    int n = heap.size();
    while (true) {
        int l = 2 * i + 1, r = 2 * i + 2, best = i;
        if (l < n && heap[l] > heap[best]) best = l;
        if (r < n && heap[r] > heap[best]) best = r;
        if (best == i) break;
        std::swap(heap[i], heap[best]);
        i = best;
    }
}

template <typename T>
void MaxHeap<T>::push(const T& val) {
    heap.push_back(val);
    heapifyUp((int)heap.size() - 1);
}

template <typename T>
T MaxHeap<T>::pop() {
    if (heap.empty()) throw std::runtime_error("Empty");
    T res = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    if (!heap.empty()) heapifyDown(0);
    return res;
}

template <typename T>
T MaxHeap<T>::top() const {
    if (heap.empty()) throw std::runtime_error("Empty");
    return heap[0];
}

template <typename T>
bool MaxHeap<T>::empty() const {
    return heap.empty();
}

template <typename T>
int MaxHeap<T>::size() const {
    return heap.size();
}

template <typename T>
std::vector<T> MaxHeap<T>::getTopN(int n) {
    MaxHeap<T> temp = *this;
    std::vector<T> res;
    for (int i = 0; i < n && !temp.empty(); ++i) {
        res.push_back(temp.pop());
    }
    return res;
}

template class MaxHeap<TutorScore>;
template class MaxHeap<int>;
