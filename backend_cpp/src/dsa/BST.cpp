#include "../../include/dsa/BST.h"

using namespace std;

template <typename K, typename V>
BST<K, V>::BSTNode::BSTNode(const K& k, const V& v) : key(k), left(nullptr), right(nullptr) {
    values.push_back(v);
}

template <typename K, typename V>
BST<K, V>::BST() : root(nullptr) {}

template <typename K, typename V>
typename BST<K, V>::BSTNode* BST<K, V>::copyTree(BSTNode* node) {
    if (node == nullptr) return nullptr;
    BSTNode* newNode = new BSTNode(node->key, V());
    newNode->values = node->values;
    newNode->left = copyTree(node->left);
    newNode->right = copyTree(node->right);
    return newNode;
}

template <typename K, typename V>
BST<K, V>::BST(const BST& other) : root(nullptr) {
    root = copyTree(other.root);
}

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
typename BST<K, V>::BSTNode* BST<K, V>::insertNode(BSTNode* node, const K& key, const V& value) {
    if (node == nullptr) {
        return new BSTNode(key, value);
    }
    if (key == node->key) {
        node->values.push_back(value);
    } else if (key < node->key) {
        node->left = insertNode(node->left, key, value);
    } else {
        node->right = insertNode(node->right, key, value);
    }
    return node;
}

template <typename K, typename V>
void BST<K, V>::insert(const K& key, const V& value) {
    root = insertNode(root, key, value);
}

template <typename K, typename V>
void BST<K, V>::findRangeHelper(BSTNode* node, const K& minKey, const K& maxKey, vector<V>& results) const {
    if (node == nullptr) {
        return;
    }
    if (minKey < node->key) {
        findRangeHelper(node->left, minKey, maxKey, results);
    }
    if (node->key >= minKey && node->key <= maxKey) {
        for (const auto& val : node->values) {
            results.push_back(val);
        }
    }
    if (maxKey > node->key) {
        findRangeHelper(node->right, minKey, maxKey, results);
    }
}

template <typename K, typename V>
vector<V> BST<K, V>::findRange(const K& minKey, const K& maxKey) const {
    vector<V> results;
    findRangeHelper(root, minKey, maxKey, results);
    return results;
}

template <typename K, typename V>
void BST<K, V>::destroyTree(BSTNode* node) {
    if (node != nullptr) {
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
