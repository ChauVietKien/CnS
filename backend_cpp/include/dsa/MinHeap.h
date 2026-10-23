#ifndef MIN_HEAP_H
#define MIN_HEAP_H

#include <vector>

template <typename T>
class MinHeap {
private:
    std::vector<T> heap;

    void heapifyUp(int index);
    void heapifyDown(int index);

public:
    MinHeap();

    void push(const T& val);
    T pop();
    T top() const;
    bool empty() const;
    int size() const;
};

#endif
