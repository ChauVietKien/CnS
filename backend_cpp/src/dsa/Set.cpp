#include "../../include/dsa/Set.h"
#include <string>

template <typename T>
Set<T>::Set() : root(nullptr), count(0) {}

template <typename T>
typename Set<T>::Node* Set<T>::copyTree(Node* node) {
    if (!node) return nullptr;
    Node* res = new Node(node->data);
    res->left = copyTree(node->left);
    res->right = copyTree(node->right);
    return res;
}

template <typename T>
Set<T>::Set(const Set& other) : root(copyTree(other.root)), count(other.count) {}

template <typename T>
Set<T>& Set<T>::operator=(const Set& other) {
    if (this != &other) {
        destroyTree(root);
        root = copyTree(other.root);
        count = other.count;
    }
    return *this;
}

template <typename T>
Set<T>::~Set() {
    destroyTree(root);
}

template <typename T>
bool Set<T>::insertHelper(Node*& node, const T& val) {
    if (!node) {
        node = new Node(val);
        count++;
        return true;
    }
    if (val == node->data) return false;
    return insertHelper(val < node->data ? node->left : node->right, val);
}

template <typename T>
bool Set<T>::insert(const T& val) {
    return insertHelper(root, val);
}

template <typename T>
bool Set<T>::containsHelper(Node* node, const T& val) const {
    if (!node) return false;
    if (val == node->data) return true;
    return containsHelper(val < node->data ? node->left : node->right, val);
}

template <typename T>
bool Set<T>::contains(const T& val) const {
    return containsHelper(root, val);
}

template <typename T>
int Set<T>::size() const {
    return count;
}

template <typename T>
bool Set<T>::empty() const {
    return count == 0;
}

template <typename T>
void Set<T>::toVectorHelper(Node* node, std::vector<T>& res) const {
    if (!node) return;
    toVectorHelper(node->left, res);
    res.push_back(node->data);
    toVectorHelper(node->right, res);
}

template <typename T>
std::vector<T> Set<T>::toVector() const {
    std::vector<T> res;
    toVectorHelper(root, res);
    return res;
}

template <typename T>
void Set<T>::destroyTree(Node* node) {
    if (node) {
        destroyTree(node->left);
        destroyTree(node->right);
        delete node;
    }
}

template class Set<std::string>;
template class Set<int>;
