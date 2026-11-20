#ifndef MAX_HEAP_H
#define MAX_HEAP_H

#include <vector>

template <typename T>
class MaxHeap {
private:
    std::vector<T> heap;

    void heapifyUp(int i);
    void heapifyDown(int i);

public:
    MaxHeap();

    void push(const T& val);
    T pop();
    T top() const;
    bool empty() const;
    int size() const;
    std::vector<T> getTopN(int n);
};

#endif
