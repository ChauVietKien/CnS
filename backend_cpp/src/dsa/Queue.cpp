#include "../../include/dsa/Queue.h"
#include <stdexcept>
#include <string>

using namespace std;

template <typename T>
Queue<T>::Node::Node(const T& val) : data(val), next(nullptr) {}

template <typename T>
Queue<T>::Queue() : frontNode(nullptr), rearNode(nullptr), count(0) {}

template <typename T>
void Queue<T>::copyFrom(const Queue& other) {
    Node* curr = other.frontNode;
    while (curr != nullptr) {
        push(curr->data);
        curr = curr->next;
    }
}

template <typename T>
Queue<T>::Queue(const Queue& other) : frontNode(nullptr), rearNode(nullptr), count(0) {
    copyFrom(other);
}

template <typename T>
Queue<T>& Queue<T>::operator=(const Queue& other) {
    if (this != &other) {
        clear();
        copyFrom(other);
    }
    return *this;
}

template <typename T>
Queue<T>::~Queue() {
    clear();
}

template <typename T>
void Queue<T>::push(const T& val) {
    Node* newNode = new Node(val);
    if (rearNode == nullptr) {
        frontNode = rearNode = newNode;
    } else {
        rearNode->next = newNode;
        rearNode = newNode;
    }
    count++;
}

template <typename T>
T Queue<T>::pop() {
    if (empty()) {
        throw runtime_error("Queue is empty");
    }
    Node* temp = frontNode;
    T val = temp->data;
    frontNode = frontNode->next;
    if (frontNode == nullptr) {
        rearNode = nullptr;
    }
    delete temp;
    count--;
    return val;
}

template <typename T>
T Queue<T>::front() const {
    if (empty()) {
        throw runtime_error("Queue is empty");
    }
    return frontNode->data;
}

template <typename T>
bool Queue<T>::empty() const {
    return frontNode == nullptr;
}

template <typename T>
int Queue<T>::size() const {
    return count;
}

template <typename T>
void Queue<T>::clear() {
    while (!empty()) {
        pop();
    }
}

template class Queue<int>;
template class Queue<string>;
