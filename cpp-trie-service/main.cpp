#ifdef _WIN32
#define _WIN32_WINNT 0x0A00
#endif

#include <iostream>
#include <string>
#include "httplib.h"

using namespace std;

// Hàm đổi chuỗi sang số an toàn (tránh crash khi param rỗng "")
int toInt(const string& s, const int def = 0) {
    if (s.empty()) return def;
    try { return stoi(s); } catch (...) { return def; }
}

// ================= 1. TRIE (SEARCH) =================
class TrieNode {
public:
    TrieNode* children[256];
    bool isEnd;
    string word;

    TrieNode() : isEnd(false), word("") {
        for (int i = 0; i < 256; i++) children[i] = nullptr;
    }
    ~TrieNode() {
        for (int i = 0; i < 256; i++) if (children[i]) delete children[i];
    }
};

class SubjectTrie {
private:
    TrieNode* root;

    void collectRec(TrieNode* node, string& json, bool& first) const {
        if (!node) return;
        if (node->isEnd) {
            if (!first) json += ",";
            json += "\"" + node->word + "\"";
            first = false;
        }
        for (int i = 0; i < 256; i++) {
            if (node->children[i]) collectRec(node->children[i], json, first);
        }
    }

public:
    SubjectTrie() : root(new TrieNode()) {}
    ~SubjectTrie() { delete root; }

    void insert(const char* w) {
        if (!w) return;
        TrieNode* curr = root;
        for (int i = 0; w[i] != '\0'; i++) {
            unsigned char idx = (unsigned char)w[i];
            if (!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
        curr->word = string(w);
    }

    string search(const char* prefix) const {
        if (!prefix) return "[]";
        TrieNode* curr = root;
        for (int i = 0; prefix[i] != '\0'; i++) {
            unsigned char idx = (unsigned char)prefix[i];
            if (!curr->children[idx]) return "[]";
            curr = curr->children[idx];
        }
        string json = "[";
        bool first = true;
        collectRec(curr, json, first);
        json += "]";
        return json;
    }
};

// ================= 2. BST (FILTER) =================
class Post {
public:
    string id, subject, method, address;
    string classId;
    int price;
    Post* next;

    Post(string id, string sub, string cId, string m, const int p, string addr)
        : id(id), subject(sub), classId(cId), method(m), price(p), address(addr), next(nullptr) {}

    // Bất kỳ trường nào rỗng ("") sẽ tự động bỏ qua (coi như thỏa mãn)
    bool match(const string& cId, const string& m, const string& prov) const {
        // 1. Nếu có truyền classId thì mới kiểm tra
        if (!cId.empty() && classId != cId) return false;

        // 2. Nếu có truyền mode thì mới kiểm tra
        if (!m.empty() && method != m) return false;

        // 3. Nếu có truyền province thì mới kiểm tra
        if (!prov.empty() && address.find(prov) == string::npos) return false;

        return true;
    }

    string toJson() const {
        return "{\"id\":\"" + id + "\"}"; // Chỉ cần trả về ID cho Node.js là đủ
    }
};

class BSTNode {
public:
    int price;
    Post* head;
    BSTNode *left, *right;

    BSTNode(Post* p) : price(p->price), head(p), left(nullptr), right(nullptr) {}
    void add(Post* p) { p->next = head; head = p; }
};

class PostBST {
private:
    BSTNode* root;

    BSTNode* insertRec(BSTNode* node, Post* p) {
        if (!node) return new BSTNode(p);
        if (p->price == node->price) node->add(p);
        else if (p->price < node->price) node->left = insertRec(node->left, p);
        else node->right = insertRec(node->right, p);
        return node;
    }

    void filterRec(BSTNode* node, const int maxP, const int cId,
                   const char* m, const char* prov, string& json, bool& first) const {
        if (!node) return;
        filterRec(node->left, maxP, cId, m, prov, json, first);

        if (node->price <= maxP) {
            for (Post* curr = node->head; curr != nullptr; curr = curr->next) {
                if (curr->match(cId, m, prov)) {
                    if (!first) json += ",";
                    json += curr->toJson();
                    first = false;
                }
            }
            filterRec(node->right, maxP, cId, m, prov, json, first);
        }
    }

    void clear(BSTNode* node) {
        if (!node) return;
        clear(node->left);
        clear(node->right);
        Post* curr = node->head;
        while (curr) { Post* tmp = curr; curr = curr->next; delete tmp; }
        delete node;
    }

public:
    PostBST() : root(nullptr) {}
    ~PostBST() { clear(root); }

    void insert(string id, string sub, const int cId, string m, const int p, string addr) {
        root = insertRec(root, new Post(id, sub, cId, m, p, addr));
    }

    string filter(const int maxP, const int cId, const char* m, const char* prov) const {
        string json = "{\"data\":[";
        bool first = true;
        filterRec(root, maxP, cId, m, prov, json, first);
        json += "]}";
        return json;
    }
};

// ================= 3. HTTP SERVER =================
int main() {
    SubjectTrie trie;
    PostBST bst;
    httplib::Server svr;

    // --- Search APIs (Trie) ---
    svr.Post("/insert", [&](const httplib::Request& req, httplib::Response& res) {
        if (req.has_param("word")) trie.insert(req.get_param_value("word").c_str());
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    svr.Get("/search", [&](const httplib::Request& req, httplib::Response& res) {
        string q = req.has_param("q") ? req.get_param_value("q") : "";
        res.set_content(trie.search(q.c_str()), "application/json; charset=utf-8");
    });

    // --- Filter APIs (BST) ---
    svr.Post("/add-post", [&](const httplib::Request& req, httplib::Response& res) {
        string id = req.get_param_value("id");
        if (!id.empty()) {
            bst.insert(
                id,
                req.get_param_value("subject"),
                toInt(req.get_param_value("classId"), 0),
                req.get_param_value("mode"),
                toInt(req.get_param_value("price"), 0),
                req.get_param_value("address")
            );
        }
        res.set_content("{\"status\":\"ok\"}", "application/json");
    });

    svr.Get("/filter", [&](const httplib::Request& req, httplib::Response& res) {
        int maxPrice = toInt(req.get_param_value("maxPrice"), 10000000);
        int classId  = toInt(req.get_param_value("classId"), 0);
        string mode  = req.get_param_value("mode");
        string prov  = req.get_param_value("province");

        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content(bst.filter(maxPrice, classId, mode.c_str(), prov.c_str()), "application/json; charset=utf-8");
    });

    cout << "C++ Service running at http://127.0.0.1:8081\n";
    svr.listen("127.0.0.1", 8081);
    return 0;
}