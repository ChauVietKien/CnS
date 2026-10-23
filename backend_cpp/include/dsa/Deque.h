#ifndef DEQUE_H
#define DEQUE_H

template <typename T>
class Deque {
private:
    struct Node {
        T data;
        Node* prev;
        Node* next;
        Node(const T& val);
    };

    Node* head;
    Node* tail;
    int count;

    void copyFrom(const Deque& other);

public:
    Deque();
    Deque(const Deque& other);
    Deque& operator=(const Deque& other);
    ~Deque();

    void pushFront(const T& val);
    void pushBack(const T& val);
    T popFront();
    T popBack();
    T front() const;
    T back() const;
    bool empty() const;
    int size() const;
    void clear();
};

#endif
