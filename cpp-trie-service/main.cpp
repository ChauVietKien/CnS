#ifdef _WIN32
#define _WIN32_WINNT 0x0A00
#endif

#include <iostream>
#include <vector>
#include <string>
#include <mutex>
#include "httplib.h"

using namespace std;

struct TrieNode {
    TrieNode* children[256];
    bool isEndOfWord;
    string fullWord;

    TrieNode() : isEndOfWord(false) {
        for (int i = 0; i < 256; i++) children[i] = nullptr;
    }
    ~TrieNode() {
        for (int i = 0; i < 256; i++) if (children[i]) delete children[i];
    }
};

class Trie {
private:
    TrieNode* root;
    mutex mtx;

    void dfs(TrieNode* node, vector<string>& res, int limit) {
        if (!node || res.size() >= limit) return;
        if (node->isEndOfWord) res.push_back(node->fullWord);
        for (int i = 0; i < 256; i++) {
            if (node->children[i]) dfs(node->children[i], res, limit);
        }
    }

public:
    Trie() { root = new TrieNode(); }
    ~Trie() { delete root; }

    void insert(const string& word) {
        lock_guard<mutex> lock(mtx);
        TrieNode* curr = root;
        for (char c : word) {
            unsigned char index = (unsigned char)c;
            if (!curr->children[index]) curr->children[index] = new TrieNode();
            curr = curr->children[index];
        }
        curr->isEndOfWord = true;
        curr->fullWord = word;
    }

    vector<string> autocomplete(const string& prefix, int limit = 10) {
        lock_guard<mutex> lock(mtx);
        TrieNode* curr = root;
        for (char c : prefix) {
            unsigned char index = (unsigned char)c;
            if (!curr->children[index]) return {};
            curr = curr->children[index];
        }
        vector<string> res;
        dfs(curr, res, limit);
        return res;
    }
};

int main() {
    Trie trie;
    // Dữ liệu mẫu (có thể đọc thêm từ file hoặc gọi API /insert để nạp)
    trie.insert("cà phê sữa đá");
    trie.insert("cà phê muối");
    trie.insert("trà đào cam sả");

    httplib::Server svr;

    // API Tìm kiếm: GET http://127.0.0.1:8081/search?q=...
    svr.Get("/search", [&](const httplib::Request& req, httplib::Response& res) {
        string query = req.has_param("q") ? req.get_param_value("q") : "";
        vector<string> words = trie.autocomplete(query, 10);

        string json = "[";
        for (size_t i = 0; i < words.size(); ++i) {
            json += "\"" + words[i] + "\"";
            if (i + 1 < words.size()) json += ",";
        }
        json += "]";
        res.set_content(json, "application/json; charset=utf-8");
    });

    // API Thêm từ: POST http://127.0.0.1:8081/insert?word=...
    svr.Post("/insert", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("word")) {
            trie.insert(req.get_param_value("word"));
            res.set_content("{\"status\":\"ok\"}", "application/json");
        } else {
            res.status = 400;
        }
    });

    cout << "C++ Search Service running at http://127.0.0.1:8081\n";
    svr.listen("127.0.0.1", 8081);
    return 0;
}