#include "../../include/dsa/MaxHeap.h"
#include "../../include/services/PostService.h"
#include <stdexcept>
#include <utility>

using namespace std;

template <typename T>
MaxHeap<T>::MaxHeap() {}

template <typename T>
void MaxHeap<T>::heapifyUp(int index) {
    while (index > 0) {
        int parent = (index - 1) / 2;
        if (heap[index] > heap[parent]) {
            swap(heap[index], heap[parent]);
            index = parent;
        } else {
            break;
        }
    }
}

template <typename T>
void MaxHeap<T>::heapifyDown(int index) {
    int n = heap.size();
    while (index < n) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int largest = index;

        if (left < n && heap[left] > heap[largest]) {
            largest = left;
        }
        if (right < n && heap[right] > heap[largest]) {
            largest = right;
        }
        if (largest != index) {
            swap(heap[index], heap[largest]);
            index = largest;
        } else {
            break;
        }
    }
}

template <typename T>
void MaxHeap<T>::push(const T& val) {
    heap.push_back(val);
    heapifyUp(heap.size() - 1);
}

template <typename T>
T MaxHeap<T>::pop() {
    if (heap.empty()) {
        throw runtime_error("Heap is empty");
    }
    T topVal = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    if (!heap.empty()) {
        heapifyDown(0);
    }
    return topVal;
}

template <typename T>
T MaxHeap<T>::top() const {
    if (heap.empty()) {
        throw runtime_error("Heap is empty");
    }
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
vector<T> MaxHeap<T>::getTopN(int n) {
    MaxHeap<T> temp = *this;
    vector<T> result;
    int count = 0;
    while (!temp.empty() && count < n) {
        result.push_back(temp.pop());
        count++;
    }
    return result;
}

template class MaxHeap<TutorScore>;
template class MaxHeap<int>;
