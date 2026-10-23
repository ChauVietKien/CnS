#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>
#include <unordered_map>

class Trie {
private:
    struct TrieNode {
        std::unordered_map<char, TrieNode*> children;
        bool isEndOfWord;
        std::vector<int> referenceIds;

        TrieNode();
        ~TrieNode();
    };

    TrieNode* root;

    std::string toLowerCase(const std::string& str) const;
    void collectWords(TrieNode* node, const std::string& prefix, std::vector<std::string>& results, int limit) const;
    void collectIds(TrieNode* node, std::vector<int>& ids) const;

public:
    Trie();
    ~Trie();

    void insert(const std::string& word, int refId = -1);
    std::vector<std::string> searchPrefix(const std::string& prefix, int limit = 10) const;
    std::vector<int> searchIdsByPrefix(const std::string& prefix) const;
};

#endif
