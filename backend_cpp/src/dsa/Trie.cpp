#include "../../include/dsa/Trie.h"
#include <algorithm>

using namespace std;

Trie::TrieNode::TrieNode() : isEndOfWord(false) {}

Trie::TrieNode::~TrieNode() {
    for (auto& pair : children) {
        delete pair.second;
    }
}

string Trie::toLowerCase(const string& str) const {
    string res = str;
    transform(res.begin(), res.end(), res.begin(), [](unsigned char c) {
        return tolower(c);
    });
    return res;
}

void Trie::collectWords(TrieNode* node, const string& prefix, vector<string>& results, int limit) const {
    if (node == nullptr || (int)results.size() >= limit) {
        return;
    }

    if (node->isEndOfWord) {
        results.push_back(prefix);
    }

    for (const auto& pair : node->children) {
        collectWords(pair.second, prefix + pair.first, results, limit);
        if ((int)results.size() >= limit) {
            return;
        }
    }
}

void Trie::collectIds(TrieNode* node, vector<int>& ids) const {
    if (node == nullptr) {
        return;
    }

    for (int id : node->referenceIds) {
        ids.push_back(id);
    }

    for (const auto& pair : node->children) {
        collectIds(pair.second, ids);
    }
}

Trie::Trie() {
    root = new TrieNode();
}

Trie::~Trie() {
    delete root;
}

void Trie::insert(const string& word, int refId) {
    string lowerWord = toLowerCase(word);
    TrieNode* curr = root;

    for (char ch : lowerWord) {
        if (curr->children.find(ch) == curr->children.end()) {
            curr->children[ch] = new TrieNode();
        }
        curr = curr->children[ch];
    }

    curr->isEndOfWord = true;
    if (refId != -1) {
        curr->referenceIds.push_back(refId);
    }
}

vector<string> Trie::searchPrefix(const string& prefix, int limit) const {
    string lowerPrefix = toLowerCase(prefix);
    TrieNode* curr = root;
    vector<string> results;

    for (char ch : lowerPrefix) {
        if (curr->children.find(ch) == curr->children.end()) {
            return results;
        }
        curr = curr->children[ch];
    }

    collectWords(curr, lowerPrefix, results, limit);
    return results;
}

vector<int> Trie::searchIdsByPrefix(const string& prefix) const {
    string lowerPrefix = toLowerCase(prefix);
    TrieNode* curr = root;
    vector<int> results;

    for (char ch : lowerPrefix) {
        if (curr->children.find(ch) == curr->children.end()) {
            return results;
        }
        curr = curr->children[ch];
    }

    collectIds(curr, results);
    return results;
}
