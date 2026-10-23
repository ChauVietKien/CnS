#ifndef BST_H
#define BST_H

#include <vector>

template <typename K, typename V>
class BST {
private:
    struct BSTNode {
        K key;
        std::vector<V> values;
        BSTNode* left;
        BSTNode* right;

        BSTNode(const K& k, const V& v);
    };

    BSTNode* root;

    BSTNode* copyTree(BSTNode* node);
    BSTNode* insertNode(BSTNode* node, const K& key, const V& value);
    void findRangeHelper(BSTNode* node, const K& minKey, const K& maxKey, std::vector<V>& results) const;
    void destroyTree(BSTNode* node);

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
