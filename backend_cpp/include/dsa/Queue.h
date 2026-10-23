#ifndef QUEUE_H
#define QUEUE_H

template <typename T>
class Queue {
private:
    struct Node {
        T data;
        Node* next;
        Node(const T& val);
    };

    Node* frontNode;
    Node* rearNode;
    int count;

    void copyFrom(const Queue& other);

public:
    Queue();
    Queue(const Queue& other);
    Queue& operator=(const Queue& other);
    ~Queue();

    void push(const T& val);
    T pop();
    T front() const;
    bool empty() const;
    int size() const;
    void clear();
};

#endif
