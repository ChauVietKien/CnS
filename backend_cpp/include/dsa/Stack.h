#ifndef STACK_H
#define STACK_H

template <typename T>
class Stack {
private:
    struct Node {
        T data;
        Node* next;
        Node(const T& val);
    };

    Node* topNode;
    int count;

    void copyFrom(const Stack& other);

public:
    Stack();
    Stack(const Stack& other);
    Stack& operator=(const Stack& other);
    ~Stack();

    void push(const T& val);
    T pop();
    T top() const;
    bool empty() const;
    int size() const;
    void clear();
};

#endif
