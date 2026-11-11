#ifndef POST_SERVICE_H
#define POST_SERVICE_H

#include <vector>
#include <string>
#include <optional>
#include "../models/TutorPost.h"
#include "../dsa/Trie.h"
#include "../dsa/BST.h"
#include "../dsa/MaxHeap.h"
#include "../dsa/Deque.h"
#include "../dsa/Set.h"
#include "../dsa/HashTable.h"

struct TutorScore {
    int postId;
    double score;

    bool operator>(const TutorScore& other) const {
        return score > other.score;
    }
};

class PostService {
private:
    HashTable<int, TutorPost> postsById;
    HashTable<int, Set<std::string>> tutorSubjects;
    HashTable<int, std::string> tutorNames;
    HashTable<int, double> tutorRatings;
    Trie searchTrie;
    BST<long long, int> tuitionBST;
    BST<int, int> ratingBST;
    Deque<int> recentlyViewedDeque;
    int nextPostId;

    void rebuildIndices();
    void indexKeywords(const std::string& text, int postId);

public:
    PostService();

    void setTutorName(int tutorId, const std::string& name);
    void updateTutorRating(int tutorId, double rating);
    double getTutorRating(int tutorId) const;

    bool createPost(int tutorId, const std::string& title, const std::string& description,
                    const std::string& subjectName, int grade, long long tuitionPerHour,
                    TeachingMode mode, const std::vector<std::string>& areas,
                    const std::string& schedule, std::string& errorMessage);

    bool updatePost(int postId, int tutorId, const std::string& title, const std::string& description,
                    long long tuitionPerHour, const std::string& schedule, std::string& errorMessage);

    bool setPostStatus(int postId, int tutorId, PostStatus status);
    bool hidePostByAdmin(int postId, const std::string& reason);
    bool unhidePostByAdmin(int postId);

    std::optional<TutorPost> getPostById(int postId) const;
    std::vector<std::string> suggest(const std::string& prefix, int limit = 5) const;
    std::vector<std::string> suggestSubjects(const std::string& prefix, int limit = 5) const;
    std::vector<TutorPost> search(const std::string& query) const;
    std::vector<TutorPost> searchBySubject(const std::string& subjectName) const;
    std::vector<TutorPost> filterByTuition(long long minPrice, long long maxPrice) const;
    std::vector<int> filterByRating(int minRatingScaled, int maxRatingScaled = 50) const;
    std::vector<TutorPost> getTopRecommended(int limit = 5);
    void recordRecentlyViewed(int postId);
    std::vector<TutorPost> getRecentlyViewed(int limit = 5);
    std::vector<TutorPost> getAllActivePosts() const;
    std::vector<TutorPost> getPostsByTutor(int tutorId) const;
    void loadPosts(const std::vector<TutorPost>& posts);
};

#endif
