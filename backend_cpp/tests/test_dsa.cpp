#include <iostream>
#include <cassert>
#include "../include/dsa/Trie.h"
#include "../include/dsa/BST.h"
#include "../include/dsa/HashTable.h"
#include "../include/dsa/MaxHeap.h"
#include "../include/dsa/MinHeap.h"
#include "../include/dsa/Queue.h"
#include "../include/dsa/Deque.h"
#include "../include/dsa/Stack.h"
#include "../include/dsa/DoublyLinkedList.h"
#include "../include/dsa/Set.h"
#include "../include/models/Review.h"

using namespace std;

int main() {
    Trie trie;
    trie.insert("Toan hoc", 1);
    trie.insert("Tieng Anh", 2);
    auto words = trie.searchPrefix("To");
    assert(words.size() == 1);
    cout << "Test Trie: PASS" << endl;

    BST<int, int> bst;
    bst.insert(100, 1);
    bst.insert(200, 2);
    bst.insert(300, 3);
    auto range = bst.findRange(150, 250);
    assert(range.size() == 1 && range[0] == 2);
    cout << "Test BST: PASS" << endl;

    HashTable<string, int> ht;
    ht.insert("kien", 10);
    ht.insert("minh", 20);
    int val = 0;
    assert(ht.find("kien", val) && val == 10);
    cout << "Test HashTable: PASS" << endl;

    Queue<int> q;
    q.push(1);
    q.push(2);
    assert(q.pop() == 1 && q.front() == 2);
    cout << "Test Queue: PASS" << endl;

    Stack<int> s;
    s.push(10);
    s.push(20);
    assert(s.pop() == 20 && s.top() == 10);
    cout << "Test Stack: PASS" << endl;

    Deque<int> dq;
    dq.pushFront(1);
    dq.pushBack(2);
    assert(dq.popFront() == 1 && dq.popBack() == 2);
    cout << "Test Deque: PASS" << endl;

    Set<string> set;
    assert(set.insert("Toan"));
    assert(!set.insert("Toan"));
    assert(set.contains("Toan"));
    cout << "Test Set: PASS" << endl;

    MinHeap<int> minH;
    minH.push(50);
    minH.push(10);
    minH.push(30);
    assert(minH.pop() == 10);
    cout << "Test MinHeap: PASS" << endl;

    MaxHeap<int> maxH;
    maxH.push(10);
    maxH.push(50);
    maxH.push(30);
    assert(maxH.pop() == 50);
    cout << "Test MaxHeap: PASS" << endl;

    DoublyLinkedList<int> dll;
    dll.pushBack(100);
    dll.pushFront(50);
    assert(dll.size() == 2);
    cout << "Test DoublyLinkedList: PASS" << endl;

    cout << "\nALL 10 DSA TESTS PASSED SUCCESSFULLY!" << endl;
    return 0;
}
