#include "../../include/dsa/Set.h"
#include <string>

using namespace std;

template <typename T>
Set<T>::BSTNode::BSTNode(const T& val) : data(val), left(nullptr), right(nullptr) {}

template <typename T>
Set<T>::Set() : root(nullptr), count(0) {}

template <typename T>
typename Set<T>::BSTNode* Set<T>::copyTree(BSTNode* node) {
    if (node == nullptr) return nullptr;
    BSTNode* newNode = new BSTNode(node->data);
    newNode->left = copyTree(node->left);
    newNode->right = copyTree(node->right);
    return newNode;
}

template <typename T>
Set<T>::Set(const Set& other) : root(nullptr), count(other.count) {
    root = copyTree(other.root);
}

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
bool Set<T>::insertHelper(BSTNode*& node, const T& val) {
    if (node == nullptr) {
        node = new BSTNode(val);
        count++;
        return true;
    }
    if (val == node->data) {
        return false;
    }
    if (val < node->data) {
        return insertHelper(node->left, val);
    } else {
        return insertHelper(node->right, val);
    }
}

template <typename T>
bool Set<T>::insert(const T& val) {
    return insertHelper(root, val);
}

template <typename T>
bool Set<T>::containsHelper(BSTNode* node, const T& val) const {
    if (node == nullptr) {
        return false;
    }
    if (val == node->data) {
        return true;
    }
    if (val < node->data) {
        return containsHelper(node->left, val);
    } else {
        return containsHelper(node->right, val);
    }
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
void Set<T>::toVectorHelper(BSTNode* node, vector<T>& res) const {
    if (node != nullptr) {
        toVectorHelper(node->left, res);
        res.push_back(node->data);
        toVectorHelper(node->right, res);
    }
}

template <typename T>
vector<T> Set<T>::toVector() const {
    vector<T> res;
    toVectorHelper(root, res);
    return res;
}

template <typename T>
void Set<T>::destroyTree(BSTNode* node) {
    if (node != nullptr) {
        destroyTree(node->left);
        destroyTree(node->right);
        delete node;
    }
}

template class Set<string>;
template class Set<int>;
