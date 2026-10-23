#include "../../include/dsa/DoublyLinkedList.h"
#include "../../include/models/Review.h"
#include <stdexcept>
#include <string>

using namespace std;

template <typename T>
DoublyLinkedList<T>::Node::Node(const T& val) : data(val), prev(nullptr), next(nullptr) {}

template <typename T>
DoublyLinkedList<T>::DoublyLinkedList() : head(nullptr), tail(nullptr), count(0) {}

template <typename T>
void DoublyLinkedList<T>::copyFrom(const DoublyLinkedList& other) {
    Node* curr = other.head;
    while (curr != nullptr) {
        pushBack(curr->data);
        curr = curr->next;
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
void DoublyLinkedList<T>::pushBack(const T& val) {
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
void DoublyLinkedList<T>::popFront() {
    if (empty()) {
        throw runtime_error("List is empty");
    }
    Node* temp = head;
    head = head->next;
    if (head != nullptr) {
        head->prev = nullptr;
    } else {
        tail = nullptr;
    }
    delete temp;
    count--;
}

template <typename T>
void DoublyLinkedList<T>::popBack() {
    if (empty()) {
        throw runtime_error("List is empty");
    }
    Node* temp = tail;
    tail = tail->prev;
    if (tail != nullptr) {
        tail->next = nullptr;
    } else {
        head = nullptr;
    }
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
    while (!empty()) {
        popFront();
    }
}

template <typename T>
vector<T> DoublyLinkedList<T>::toVector() const {
    vector<T> list;
    Node* curr = head;
    while (curr != nullptr) {
        list.push_back(curr->data);
        curr = curr->next;
    }
    return list;
}

template class DoublyLinkedList<Review>;
template class DoublyLinkedList<int>;
template class DoublyLinkedList<string>;
