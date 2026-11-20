#include "../../include/dsa/DoublyLinkedList.h"
#include "../../include/models/Review.h"
#include <stdexcept>
#include <string>

template <typename T>
DoublyLinkedList<T>::DoublyLinkedList() : head(nullptr), tail(nullptr), count(0) {}

template <typename T>
void DoublyLinkedList<T>::copyFrom(const DoublyLinkedList& other) {
    for (Node* curr = other.head; curr; curr = curr->next) {
        pushBack(curr->data);
    }
}

template <typename T>
DoublyLinkedList<T>::DoublyLinkedList(const DoublyLinkedList& other) : head(nullptr), tail(nullptr), count(0) {
    copyFrom(other);
}

template <typename T>
DoublyLinkedList<T>& DoublyLinkedList<T>::operator=(const DoublyLinkedList& other) {
    if (this != &other) {
        clear();
        copyFrom(other);
    }
    return *this;
}

template <typename T>
DoublyLinkedList<T>::~DoublyLinkedList() {
    clear();
}

template <typename T>
void DoublyLinkedList<T>::pushFront(const T& val) {
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
void DoublyLinkedList<T>::pushBack(const T& val) {
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
void DoublyLinkedList<T>::popFront() {
    if (empty()) throw std::runtime_error("Empty");
    Node* temp = head;
    head = head->next;
    if (head) head->prev = nullptr;
    else tail = nullptr;
    delete temp;
    count--;
}

template <typename T>
void DoublyLinkedList<T>::popBack() {
    if (empty()) throw std::runtime_error("Empty");
    Node* temp = tail;
    tail = tail->prev;
    if (tail) tail->next = nullptr;
    else head = nullptr;
    delete temp;
    count--;
}

template <typename T>
bool DoublyLinkedList<T>::empty() const {
    return count == 0;
}

template <typename T>
int DoublyLinkedList<T>::size() const {
    return count;
}

template <typename T>
void DoublyLinkedList<T>::clear() {
    while (!empty()) popFront();
}

template <typename T>
std::vector<T> DoublyLinkedList<T>::toVector() const {
    std::vector<T> res;
    for (Node* curr = head; curr; curr = curr->next) {
        res.push_back(curr->data);
    }
    return res;
}

template class DoublyLinkedList<Review>;
template class DoublyLinkedList<int>;
template class DoublyLinkedList<std::string>;
