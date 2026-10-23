#include "../../include/dsa/Deque.h"
#include <stdexcept>
#include <string>

using namespace std;

template <typename T>
Deque<T>::Node::Node(const T& val) : data(val), prev(nullptr), next(nullptr) {}

template <typename T>
Deque<T>::Deque() : head(nullptr), tail(nullptr), count(0) {}

template <typename T>
void Deque<T>::copyFrom(const Deque& other) {
    Node* curr = other.head;
    while (curr != nullptr) {
        pushBack(curr->data);
        curr = curr->next;
    }
}

template <typename T>
Deque<T>::Deque(const Deque& other) : head(nullptr), tail(nullptr), count(0) {
    copyFrom(other);
}

template <typename T>
Deque<T>& Deque<T>::operator=(const Deque& other) {
    if (this != &other) {
        clear();
        copyFrom(other);
    }
    return *this;
}

template <typename T>
Deque<T>::~Deque() {
    clear();
}

template <typename T>
void Deque<T>::pushFront(const T& val) {
    Node* newNode = new Node(val);
    if (head == nullptr) {
        head = tail = newNode;
    } else {
        newNode->next = head;
        head->prev = newNode;
        head = newNode;
    }
    count++;
}

template <typename T>
void Deque<T>::pushBack(const T& val) {
    Node* newNode = new Node(val);
    if (tail == nullptr) {
        head = tail = newNode;
    } else {
        newNode->prev = tail;
        tail->next = newNode;
        tail = newNode;
    }
    count++;
}

template <typename T>
T Deque<T>::popFront() {
    if (empty()) {
        throw runtime_error("Deque is empty");
    }
    Node* temp = head;
    T val = temp->data;
    head = head->next;
    if (head != nullptr) {
        head->prev = nullptr;
    } else {
        tail = nullptr;
    }
    delete temp;
    count--;
    return val;
}

template <typename T>
T Deque<T>::popBack() {
    if (empty()) {
        throw runtime_error("Deque is empty");
    }
    Node* temp = tail;
    T val = temp->data;
    tail = tail->prev;
    if (tail != nullptr) {
        tail->next = nullptr;
    } else {
        head = nullptr;
    }
    delete temp;
    count--;
    return val;
}

template <typename T>
T Deque<T>::front() const {
    if (empty()) {
        throw runtime_error("Deque is empty");
    }
    return head->data;
}

template <typename T>
T Deque<T>::back() const {
    if (empty()) {
        throw runtime_error("Deque is empty");
    }
    return tail->data;
}

template <typename T>
bool Deque<T>::empty() const {
    return count == 0;
}

template <typename T>
int Deque<T>::size() const {
    return count;
}

template <typename T>
void Deque<T>::clear() {
    while (!empty()) {
        popFront();
    }
}

template class Deque<int>;
template class Deque<string>;
