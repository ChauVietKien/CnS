#include "../../include/dsa/HashTable.h"
#include "../../include/models/User.h"
#include "../../include/models/TutorProfile.h"
#include "../../include/models/TutorPost.h"
#include "../../include/models/Application.h"
#include "../../include/dsa/Set.h"
#include <string>
#include <functional>

template <typename K, typename V>
HashTable<K, V>::HashTable(int initCapacity) : capacity(initCapacity), size(0) {
    table.assign(capacity, nullptr);
}

template <typename K, typename V>
void HashTable<K, V>::copyFrom(const HashTable& other) {
    capacity = other.capacity;
    table.assign(capacity, nullptr);
    size = 0;
    for (int i = 0; i < other.capacity; ++i) {
        for (HashNode* curr = other.table[i]; curr; curr = curr->next) {
            insert(curr->key, curr->value);
        }
    }
}

template <typename K, typename V>
HashTable<K, V>::HashTable(const HashTable& other) {
    copyFrom(other);
}

template <typename K, typename V>
HashTable<K, V>& HashTable<K, V>::operator=(const HashTable& other) {
    if (this != &other) {
        clear();
        copyFrom(other);
    }
    return *this;
}

template <typename K, typename V>
HashTable<K, V>::~HashTable() {
    clear();
}

template <typename K, typename V>
int HashTable<K, V>::hashFunction(const K& key) const {
    return std::hash<K>{}(key) % capacity;
}

template <typename K, typename V>
void HashTable<K, V>::rehash() {
    int oldCapacity = capacity;
    std::vector<HashNode*> oldTable = table;
    capacity *= 2;
    table.assign(capacity, nullptr);
    size = 0;

    for (int i = 0; i < oldCapacity; ++i) {
        HashNode* curr = oldTable[i];
        while (curr) {
            insert(curr->key, curr->value);
            HashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
    }
}

template <typename K, typename V>
void HashTable<K, V>::insert(const K& key, const V& value) {
    if ((float)size / capacity > 0.75f) rehash();

    int idx = hashFunction(key);
    for (HashNode* curr = table[idx]; curr; curr = curr->next) {
        if (curr->key == key) {
            curr->value = value;
            return;
        }
    }

    HashNode* node = new HashNode(key, value);
    node->next = table[idx];
    table[idx] = node;
    size++;
}

template <typename K, typename V>
bool HashTable<K, V>::find(const K& key, V& outValue) const {
    int idx = hashFunction(key);
    for (HashNode* curr = table[idx]; curr; curr = curr->next) {
        if (curr->key == key) {
            outValue = curr->value;
            return true;
        }
    }
    return false;
}

template <typename K, typename V>
bool HashTable<K, V>::contains(const K& key) const {
    int idx = hashFunction(key);
    for (HashNode* curr = table[idx]; curr; curr = curr->next) {
        if (curr->key == key) return true;
    }
    return false;
}

template <typename K, typename V>
bool HashTable<K, V>::remove(const K& key) {
    int idx = hashFunction(key);
    HashNode* curr = table[idx];
    HashNode* prev = nullptr;

    while (curr) {
        if (curr->key == key) {
            if (!prev) table[idx] = curr->next;
            else prev->next = curr->next;
            delete curr;
            size--;
            return true;
        }
        prev = curr;
        curr = curr->next;
    }
    return false;
}

template <typename K, typename V>
void HashTable<K, V>::clear() {
    for (int i = 0; i < capacity; ++i) {
        HashNode* curr = table[i];
        while (curr) {
            HashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
        table[i] = nullptr;
    }
    size = 0;
}

template <typename K, typename V>
int HashTable<K, V>::getSize() const {
    return size;
}

template <typename K, typename V>
bool HashTable<K, V>::isEmpty() const {
    return size == 0;
}

template <typename K, typename V>
std::vector<V> HashTable<K, V>::getAllValues() const {
    std::vector<V> res;
    for (int i = 0; i < capacity; ++i) {
        for (HashNode* curr = table[i]; curr; curr = curr->next) {
            res.push_back(curr->value);
        }
    }
    return res;
}

template class HashTable<std::string, User>;
template class HashTable<std::string, bool>;
template class HashTable<int, TutorProfile>;
template class HashTable<int, TutorPost>;
template class HashTable<int, Set<std::string>>;
template class HashTable<int, Application>;
template class HashTable<int, int>;
template class HashTable<std::string, std::string>;
template class HashTable<std::string, int>;
template class HashTable<int, std::string>;
template class HashTable<int, double>;
