#include "../../include/dsa/BST.h"

template <typename K, typename V>
BST<K, V>::BST() : root(nullptr) {}

template <typename K, typename V>
typename BST<K, V>::Node* BST<K, V>::copyTree(Node* node) {
    if (!node) return nullptr;
    Node* res = new Node(node->key, V());
    res->values = node->values;
    res->left = copyTree(node->left);
    res->right = copyTree(node->right);
    return res;
}

template <typename K, typename V>
BST<K, V>::BST(const BST& other) : root(copyTree(other.root)) {}

template <typename K, typename V>
BST<K, V>& BST<K, V>::operator=(const BST& other) {
    if (this != &other) {
        destroyTree(root);
        root = copyTree(other.root);
    }
    return *this;
}

template <typename K, typename V>
BST<K, V>::~BST() {
    destroyTree(root);
}

template <typename K, typename V>
typename BST<K, V>::Node* BST<K, V>::insertNode(Node* node, const K& key, const V& value) {
    if (!node) return new Node(key, value);
    if (key == node->key) node->values.push_back(value);
    else if (key < node->key) node->left = insertNode(node->left, key, value);
    else node->right = insertNode(node->right, key, value);
    return node;
}

template <typename K, typename V>
void BST<K, V>::insert(const K& key, const V& value) {
    root = insertNode(root, key, value);
}

template <typename K, typename V>
void BST<K, V>::findRangeHelper(Node* node, const K& minKey, const K& maxKey, std::vector<V>& res) const {
    if (!node) return;
    if (minKey < node->key) findRangeHelper(node->left, minKey, maxKey, res);
    if (node->key >= minKey && node->key <= maxKey) {
        for (const auto& v : node->values) res.push_back(v);
    }
    if (maxKey > node->key) findRangeHelper(node->right, minKey, maxKey, res);
}

template <typename K, typename V>
std::vector<V> BST<K, V>::findRange(const K& minKey, const K& maxKey) const {
    std::vector<V> res;
    findRangeHelper(root, minKey, maxKey, res);
    return res;
}

template <typename K, typename V>
void BST<K, V>::destroyTree(Node* node) {
    if (node) {
        destroyTree(node->left);
        destroyTree(node->right);
        delete node;
    }
}

template <typename K, typename V>
void BST<K, V>::clear() {
    destroyTree(root);
    root = nullptr;
}

template class BST<long long, int>;
template class BST<int, int>;
