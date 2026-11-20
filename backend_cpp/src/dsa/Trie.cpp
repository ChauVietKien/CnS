#include "../../include/dsa/Trie.h"
#include <algorithm>

Trie::Node::~Node() {
    for (auto& pair : children) delete pair.second;
}

std::string Trie::toLowerCase(const std::string& str) const {
    std::string res = str;
    std::transform(res.begin(), res.end(), res.begin(), [](unsigned char c) {
        return std::tolower(c);
    });
    return res;
}

void Trie::collectWords(Node* node, const std::string& prefix, std::vector<std::string>& results, int limit) const {
    if (!node || (int)results.size() >= limit) return;
    if (node->isEndOfWord) results.push_back(prefix);
    for (const auto& pair : node->children) {
        collectWords(pair.second, prefix + pair.first, results, limit);
        if ((int)results.size() >= limit) return;
    }
}

void Trie::collectIds(Node* node, std::vector<int>& ids) const {
    if (!node) return;
    for (int id : node->referenceIds) ids.push_back(id);
    for (const auto& pair : node->children) collectIds(pair.second, ids);
}

Trie::Trie() : root(new Node()) {}

Trie::~Trie() {
    delete root;
}

void Trie::clear() {
    delete root;
    root = new Node();
}

void Trie::insert(const std::string& word, int refId) {
    std::string lower = toLowerCase(word);
    Node* curr = root;
    for (char ch : lower) {
        if (!curr->children.count(ch)) curr->children[ch] = new Node();
        curr = curr->children[ch];
    }
    curr->isEndOfWord = true;
    if (refId != -1) curr->referenceIds.push_back(refId);
}

std::vector<std::string> Trie::searchPrefix(const std::string& prefix, int limit) const {
    std::string lower = toLowerCase(prefix);
    Node* curr = root;
    std::vector<std::string> results;
    for (char ch : lower) {
        if (!curr->children.count(ch)) return results;
        curr = curr->children[ch];
    }
    collectWords(curr, lower, results, limit);
    return results;
}

std::vector<int> Trie::searchIdsByPrefix(const std::string& prefix) const {
    std::string lower = toLowerCase(prefix);
    Node* curr = root;
    std::vector<int> results;
    for (char ch : lower) {
        if (!curr->children.count(ch)) return results;
        curr = curr->children[ch];
    }
    collectIds(curr, results);
    return results;
}
