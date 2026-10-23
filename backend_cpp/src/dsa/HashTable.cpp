#include "../../include/dsa/HashTable.h"
#include "../../include/models/User.h"
#include "../../include/models/TutorProfile.h"
#include "../../include/models/TutorPost.h"
#include "../../include/models/Booking.h"
#include "../../include/dsa/Set.h"
#include <string>
#include <functional>

using namespace std;

template <typename K, typename V>
HashTable<K, V>::HashNode::HashNode(const K& k, const V& v) : key(k), value(v), next(nullptr) {}

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
        HashNode* curr = other.table[i];
        while (curr != nullptr) {
            insert(curr->key, curr->value);
            curr = curr->next;
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
    return hash<K>{}(key) % capacity;
}

template <typename K, typename V>
void HashTable<K, V>::rehash() {
    int oldCapacity = capacity;
    vector<HashNode*> oldTable = table;

    capacity *= 2;
    table.assign(capacity, nullptr);
    size = 0;

    for (int i = 0; i < oldCapacity; ++i) {
        HashNode* curr = oldTable[i];
        while (curr != nullptr) {
            insert(curr->key, curr->value);
            HashNode* temp = curr;
            curr = curr->next;
            delete temp;
        }
    }
}

template <typename K, typename V>
void HashTable<K, V>::insert(const K& key, const V& value) {
    if ((float)size / capacity > 0.75f) {
        rehash();
    }

    int index = hashFunction(key);
    HashNode* curr = table[index];

    while (curr != nullptr) {
        if (curr->key == key) {
            curr->value = value;
            return;
        }
        curr = curr->next;
    }

    HashNode* newNode = new HashNode(key, value);
    newNode->next = table[index];
    table[index] = newNode;
    size++;
}

template <typename K, typename V>
bool HashTable<K, V>::find(const K& key, V& outValue) const {
    int index = hashFunction(key);
    HashNode* curr = table[index];

    while (curr != nullptr) {
        if (curr->key == key) {
            outValue = curr->value;
            return true;
        }
        curr = curr->next;
    }
    return false;
}

template <typename K, typename V>
bool HashTable<K, V>::contains(const K& key) const {
    V dummy;
    return find(key, dummy);
}

template <typename K, typename V>
bool HashTable<K, V>::remove(const K& key) {
    int index = hashFunction(key);
    HashNode* curr = table[index];
    HashNode* prev = nullptr;

    while (curr != nullptr) {
        if (curr->key == key) {
            if (prev == nullptr) {
                table[index] = curr->next;
            } else {
                prev->next = curr->next;
            }
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
        while (curr != nullptr) {
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
vector<V> HashTable<K, V>::getAllValues() const {
    vector<V> values;
    for (int i = 0; i < capacity; ++i) {
        HashNode* curr = table[i];
        while (curr != nullptr) {
            values.push_back(curr->value);
            curr = curr->next;
        }
    }
    return values;
}

template class HashTable<string, User>;
template class HashTable<string, bool>;
template class HashTable<int, TutorProfile>;
template class HashTable<int, TutorPost>;
template class HashTable<int, Set<string>>;
template class HashTable<int, Booking>;
template class HashTable<int, int>;
template class HashTable<string, string>;
template class HashTable<string, int>;
