#ifndef BST_H
#define BST_H

#include <vector>

template <typename K, typename V>
class BST {
private:
    struct Node {
        K key;
        std::vector<V> values;
        Node* left;
        Node* right;
        Node(const K& k, const V& v) : key(k), values{v}, left(nullptr), right(nullptr) {}
    };

    Node* root;

    Node* copyTree(Node* node);
    Node* insertNode(Node* node, const K& key, const V& value);
    void findRangeHelper(Node* node, const K& minKey, const K& maxKey, std::vector<V>& res) const;
    void destroyTree(Node* node);

public:
    BST();
    BST(const BST& other);
    BST& operator=(const BST& other);
    ~BST();

    void insert(const K& key, const V& value);
    std::vector<V> findRange(const K& minKey, const K& maxKey) const;
    void clear();
};

#endif
