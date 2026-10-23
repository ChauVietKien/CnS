#ifndef DOUBLY_LINKED_LIST_H
#define DOUBLY_LINKED_LIST_H

#include <vector>

template <typename T>
class DoublyLinkedList {
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

    void copyFrom(const DoublyLinkedList& other);

public:
    DoublyLinkedList();
    DoublyLinkedList(const DoublyLinkedList& other);
    DoublyLinkedList& operator=(const DoublyLinkedList& other);
    ~DoublyLinkedList();

    void pushFront(const T& val);
    void pushBack(const T& val);
    void popFront();
    void popBack();
    bool empty() const;
    int size() const;
    void clear();
    std::vector<T> toVector() const;
};

#endif
