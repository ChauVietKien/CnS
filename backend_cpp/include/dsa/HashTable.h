#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include <vector>

template <typename K, typename V>
class HashTable {
private:
    struct HashNode {
        K key;
        V value;
        HashNode* next;
        HashNode(const K& k, const V& v);
    };

    std::vector<HashNode*> table;
    int capacity;
    int size;

    int hashFunction(const K& key) const;
    void rehash();
    void copyFrom(const HashTable& other);

public:
    HashTable(int initCapacity = 101);
    HashTable(const HashTable& other);
    HashTable& operator=(const HashTable& other);
    ~HashTable();

    void insert(const K& key, const V& value);
    bool find(const K& key, V& outValue) const;
    bool contains(const K& key) const;
    bool remove(const K& key);
    void clear();
    int getSize() const;
    bool isEmpty() const;
    std::vector<V> getAllValues() const;
};

#endif
