#ifndef SET_H
#define SET_H

#include <vector>

template <typename T>
class Set {
private:
    struct BSTNode {
        T data;
        BSTNode* left;
        BSTNode* right;
        BSTNode(const T& val);
    };

    BSTNode* root;
    int count;

    BSTNode* copyTree(BSTNode* node);
    bool insertHelper(BSTNode*& node, const T& val);
    bool containsHelper(BSTNode* node, const T& val) const;
    void toVectorHelper(BSTNode* node, std::vector<T>& res) const;
    void destroyTree(BSTNode* node);

public:
    Set();
    Set(const Set& other);
    Set& operator=(const Set& other);
    ~Set();

    bool insert(const T& val);
    bool contains(const T& val) const;
    int size() const;
    bool empty() const;
    std::vector<T> toVector() const;
};

#endif
