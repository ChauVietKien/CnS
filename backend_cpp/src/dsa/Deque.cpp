#include "../../include/dsa/Deque.h"
#include <stdexcept>
#include <string>

template <typename T>
Deque<T>::Deque() : head(nullptr), tail(nullptr), count(0) {}

template <typename T>
void Deque<T>::copyFrom(const Deque& other) {
    for (Node* curr = other.head; curr; curr = curr->next) {
        pushBack(curr->data);
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
    Node* node = new Node(val);
    if (!head) {
        head = tail = node;
    } else {
        node->next = head;
        head->prev = node;
        head = node;
    }
    count++;
}

template <typename T>
void Deque<T>::pushBack(const T& val) {
    Node* node = new Node(val);
    if (!tail) {
        head = tail = node;
    } else {
        node->prev = tail;
        tail->next = node;
        tail = node;
    }
    count++;
}

template <typename T>
T Deque<T>::popFront() {
    if (empty()) throw std::runtime_error("Empty");
    Node* temp = head;
    T val = temp->data;
    head = head->next;
    if (head) head->prev = nullptr;
    else tail = nullptr;
    delete temp;
    count--;
    return val;
}

template <typename T>
T Deque<T>::popBack() {
    if (empty()) throw std::runtime_error("Empty");
    Node* temp = tail;
    T val = temp->data;
    tail = tail->prev;
    if (tail) tail->next = nullptr;
    else head = nullptr;
    delete temp;
    count--;
    return val;
}

template <typename T>
T Deque<T>::front() const {
    if (empty()) throw std::runtime_error("Empty");
    return head->data;
}

template <typename T>
T Deque<T>::back() const {
    if (empty()) throw std::runtime_error("Empty");
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
    while (!empty()) popFront();
}

template class Deque<int>;
template class Deque<std::string>;
