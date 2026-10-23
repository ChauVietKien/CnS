#include "../../include/dsa/Stack.h"
#include <stdexcept>
#include <string>

using namespace std;

template <typename T>
Stack<T>::Node::Node(const T& val) : data(val), next(nullptr) {}

template <typename T>
Stack<T>::Stack() : topNode(nullptr), count(0) {}

template <typename T>
void Stack<T>::copyFrom(const Stack& other) {
    if (other.topNode == nullptr) return;

    Node* curr = other.topNode;
    Node* prev = nullptr;
    while (curr != nullptr) {
        Node* newNode = new Node(curr->data);
        if (prev == nullptr) {
            topNode = newNode;
        } else {
            prev->next = newNode;
        }
        prev = newNode;
        curr = curr->next;
    }
    count = other.count;
}

template <typename T>
Stack<T>::Stack(const Stack& other) : topNode(nullptr), count(0) {
    copyFrom(other);
}

template <typename T>
Stack<T>& Stack<T>::operator=(const Stack& other) {
    if (this != &other) {
        clear();
        copyFrom(other);
    }
    return *this;
}

template <typename T>
Stack<T>::~Stack() {
    clear();
}

template <typename T>
void Stack<T>::push(const T& val) {
    Node* newNode = new Node(val);
    newNode->next = topNode;
    topNode = newNode;
    count++;
}

template <typename T>
T Stack<T>::pop() {
    if (empty()) {
        throw runtime_error("Stack is empty");
    }
    Node* temp = topNode;
    T val = temp->data;
    topNode = topNode->next;
    delete temp;
    count--;
    return val;
}

template <typename T>
T Stack<T>::top() const {
    if (empty()) {
        throw runtime_error("Stack is empty");
    }
    return topNode->data;
}

template <typename T>
bool Stack<T>::empty() const {
    return topNode == nullptr;
}

template <typename T>
int Stack<T>::size() const {
    return count;
}

template <typename T>
void Stack<T>::clear() {
    while (!empty()) {
        pop();
    }
}

template class Stack<int>;
template class Stack<string>;
