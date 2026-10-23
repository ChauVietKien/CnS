#include "../../include/dsa/MinHeap.h"
#include "../../include/services/BookingService.h"
#include <stdexcept>
#include <utility>

using namespace std;

template <typename T>
MinHeap<T>::MinHeap() {}

template <typename T>
void MinHeap<T>::heapifyUp(int index) {
    while (index > 0) {
        int parent = (index - 1) / 2;
        if (heap[index] < heap[parent]) {
            swap(heap[index], heap[parent]);
            index = parent;
        } else {
            break;
        }
    }
}

template <typename T>
void MinHeap<T>::heapifyDown(int index) {
    int n = heap.size();
    while (index < n) {
        int left = 2 * index + 1;
        int right = 2 * index + 2;
        int smallest = index;

        if (left < n && heap[left] < heap[smallest]) {
            smallest = left;
        }
        if (right < n && heap[right] < heap[smallest]) {
            smallest = right;
        }
        if (smallest != index) {
            swap(heap[index], heap[smallest]);
            index = smallest;
        } else {
            break;
        }
    }
}

template <typename T>
void MinHeap<T>::push(const T& val) {
    heap.push_back(val);
    heapifyUp(heap.size() - 1);
}

template <typename T>
T MinHeap<T>::pop() {
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
T MinHeap<T>::top() const {
    if (heap.empty()) {
        throw runtime_error("Heap is empty");
    }
    return heap[0];
}

template <typename T>
bool MinHeap<T>::empty() const {
    return heap.empty();
}

template <typename T>
int MinHeap<T>::size() const {
    return heap.size();
}

template class MinHeap<ScheduleEvent>;
template class MinHeap<int>;
