#ifndef SET_H
#define SET_H

#include <vector>

template <typename T>
class Set {
private:
    struct Node {
        T data;
        Node* left;
        Node* right;
        Node(const T& val) : data(val), left(nullptr), right(nullptr) {}
    };

    Node* root;
    int count;

    Node* copyTree(Node* node);
    bool insertHelper(Node*& node, const T& val);
    bool containsHelper(Node* node, const T& val) const;
    void toVectorHelper(Node* node, std::vector<T>& res) const;
    void destroyTree(Node* node);

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
