#include "../../include/services/PostService.h"

using namespace std;

PostService::PostService() : nextPostId(1) {}

void PostService::setTutorName(int tutorId, const string& name) {
    tutorNames.insert(tutorId, name);
    vector<TutorPost> posts = postsById.getAllValues();
    for (const auto& p : posts) {
        if (p.getTutorId() == tutorId && p.isVisible()) {
            indexKeywords(name, p.getId());
        }
    }
}

void PostService::updateTutorRating(int tutorId, double rating) {
    tutorRatings.insert(tutorId, rating);
    rebuildIndices();
}

double PostService::getTutorRating(int tutorId) const {
    double r = 5.0;
    if (tutorRatings.find(tutorId, r)) {
        return r;
    }
    return 5.0;
}

vector<int> PostService::filterByRating(int minRatingScaled, int maxRatingScaled) const {
    return ratingBST.findRange(minRatingScaled, maxRatingScaled);
}

void PostService::indexKeywords(const string& text, int postId) {
    if (text.empty()) return;
    searchTrie.insert(text, postId);
    size_t pos = 0;
    while ((pos = text.find(' ', pos)) != string::npos) {
        pos++;
        if (pos < text.length()) {
            searchTrie.insert(text.substr(pos), postId);
        }
    }
}

void PostService::rebuildIndices() {
    vector<TutorPost> posts = postsById.getAllValues();
    tuitionBST.clear();
    ratingBST.clear();
    searchTrie.clear();
    for (const auto& p : posts) {
        if (p.isVisible()) {
            indexKeywords(p.getSubjectName(), p.getId());
            string tName;
            if (tutorNames.find(p.getTutorId(), tName) && !tName.empty()) {
                indexKeywords(tName, p.getId());
            }
            tuitionBST.insert(p.getTuitionPerHour(), p.getId());
            double r = 5.0;
            tutorRatings.find(p.getTutorId(), r);
            ratingBST.insert((int)(r * 10), p.getId());
        }
    }
}

bool PostService::createPost(int tutorId, const string& title, const string& description,
                            const string& subjectName, int grade, long long tuitionPerHour,
                            TeachingMode mode, const vector<string>& areas,
                            const string& schedule, string& errorMessage) {
    if (title.empty() || subjectName.empty()) {
        errorMessage = "Title and subject name cannot be empty";
        return false;
    }

    if (grade < 1 || grade > 12) {
        errorMessage = "Grade must be between 1 and 12";
        return false;
    }

    if (tuitionPerHour <= 0) {
        errorMessage = "Tuition per hour must be greater than 0";
        return false;
    }

    if (mode == TeachingMode::OFFLINE && areas.empty()) {
        errorMessage = "Offline teaching requires at least one area";
        return false;
    }

    string slotKey = subjectName + "_" + to_string(grade) + "_" + schedule;
    Set<string> subjects;
    if (tutorSubjects.find(tutorId, subjects)) {
        if (subjects.contains(slotKey)) {
            errorMessage = "Gia sư đã có bài đăng cho môn học này với cùng lớp và lịch học!";
            return false;
        }
    }

    int id = nextPostId++;
    TutorPost post(id, tutorId, title, subjectName, grade, tuitionPerHour, mode);
    post.setDescription(description);
    post.setAreas(areas);
    post.setSchedule(schedule);

    postsById.insert(id, post);

    subjects.insert(slotKey);
    tutorSubjects.insert(tutorId, subjects);

    indexKeywords(subjectName, id);
    string tName;
    if (tutorNames.find(tutorId, tName) && !tName.empty()) {
        indexKeywords(tName, id);
    }
    tuitionBST.insert(tuitionPerHour, id);
    double r = 5.0;
    tutorRatings.find(tutorId, r);
    ratingBST.insert((int)(r * 10), id);

    return true;
}

bool PostService::updatePost(int postId, int tutorId, const string& title, const string& description,
                            long long tuitionPerHour, const string& schedule, string& errorMessage) {
    TutorPost post;
    if (!postsById.find(postId, post)) {
        errorMessage = "Post not found";
        return false;
    }

    if (post.getTutorId() != tutorId) {
        errorMessage = "Unauthorized";
        return false;
    }

    post.setTitle(title);
    post.setDescription(description);
    post.setTuitionPerHour(tuitionPerHour);
    post.setSchedule(schedule);

    postsById.insert(postId, post);
    rebuildIndices();
    return true;
}

bool PostService::setPostStatus(int postId, int tutorId, PostStatus status) {
    TutorPost post;
    if (postsById.find(postId, post)) {
        if (post.getTutorId() == tutorId) {
            post.setStatus(status);
            postsById.insert(postId, post);
            rebuildIndices();
            return true;
        }
    }
    return false;
}

bool PostService::hidePostByAdmin(int postId, const string& reason) {
    TutorPost post;
    if (postsById.find(postId, post)) {
        post.setIsHiddenByAdmin(true);
        post.setAdminHiddenReason(reason);
        postsById.insert(postId, post);
        rebuildIndices();
        return true;
    }
    return false;
}

bool PostService::unhidePostByAdmin(int postId) {
    TutorPost post;
    if (postsById.find(postId, post)) {
        post.setIsHiddenByAdmin(false);
        post.setAdminHiddenReason("");
        postsById.insert(postId, post);
        rebuildIndices();
        return true;
    }
    return false;
}

optional<TutorPost> PostService::getPostById(int postId) const {
    TutorPost p;
    if (postsById.find(postId, p)) {
        return p;
    }
    return nullopt;
}

vector<string> PostService::suggest(const string& prefix, int limit) const {
    return searchTrie.searchPrefix(prefix, limit);
}

vector<string> PostService::suggestSubjects(const string& prefix, int limit) const {
    return suggest(prefix, limit);
}

vector<TutorPost> PostService::search(const string& query) const {
    vector<int> ids = searchTrie.searchIdsByPrefix(query);
    Set<int> uniqueIds;
    for (int id : ids) {
        uniqueIds.insert(id);
    }
    vector<int> deduplicated = uniqueIds.toVector();
    vector<TutorPost> results;
    for (int id : deduplicated) {
        TutorPost p;
        if (postsById.find(id, p) && p.isVisible()) {
            results.push_back(p);
        }
    }
    return results;
}

vector<TutorPost> PostService::searchBySubject(const string& subjectName) const {
    return search(subjectName);
}

vector<TutorPost> PostService::filterByTuition(long long minPrice, long long maxPrice) const {
    vector<int> ids = tuitionBST.findRange(minPrice, maxPrice);
    vector<TutorPost> results;
    for (int id : ids) {
        TutorPost p;
        if (postsById.find(id, p) && p.isVisible()) {
            results.push_back(p);
        }
    }
    return results;
}

vector<TutorPost> PostService::getTopRecommended(int limit) {
    MaxHeap<TutorScore> heap;
    vector<TutorPost> all = postsById.getAllValues();

    for (const auto& p : all) {
        if (p.isVisible()) {
            double rating = 5.0;
            tutorRatings.find(p.getTutorId(), rating);
            // Score = (Rating * 20) + Điểm học phí hợp lý
            double priceFactor = 1000.0 / (p.getTuitionPerHour() > 0 ? (p.getTuitionPerHour() / 10000.0) : 1.0);
            double score = (rating * 20.0) + (priceFactor * 0.5);
            heap.push({p.getId(), score});
        }
    }

    vector<TutorScore> topScores = heap.getTopN(limit);
    vector<TutorPost> results;
    for (const auto& s : topScores) {
        TutorPost p;
        if (postsById.find(s.postId, p)) {
            results.push_back(p);
        }
    }
    return results;
}

void PostService::recordRecentlyViewed(int postId) {
    vector<int> current;
    while (!recentlyViewedDeque.empty()) {
        int id = recentlyViewedDeque.popFront();
        if (id != postId) {
            current.push_back(id);
        }
    }
    recentlyViewedDeque.pushFront(postId);
    for (int id : current) {
        if (recentlyViewedDeque.size() < 6) {
            recentlyViewedDeque.pushBack(id);
        }
    }
}

vector<TutorPost> PostService::getRecentlyViewed(int limit) {
    vector<TutorPost> results;
    vector<int> temp;
    while (!recentlyViewedDeque.empty()) {
        int id = recentlyViewedDeque.popFront();
        temp.push_back(id);
        TutorPost p;
        if (postsById.find(id, p) && p.isVisible()) {
            if ((int)results.size() < limit) {
                results.push_back(p);
            }
        }
    }
    for (int id : temp) {
        recentlyViewedDeque.pushBack(id);
    }
    return results;
}

vector<TutorPost> PostService::getAllActivePosts() const {
    vector<TutorPost> all = postsById.getAllValues();
    vector<TutorPost> active;
    for (const auto& p : all) {
        if (p.isVisible()) {
            active.push_back(p);
        }
    }
    return active;
}

vector<TutorPost> PostService::getPostsByTutor(int tutorId) const {
    vector<TutorPost> all = postsById.getAllValues();
    vector<TutorPost> tutorPosts;
    for (const auto& p : all) {
        if (p.getTutorId() == tutorId) {
            tutorPosts.push_back(p);
        }
    }
    return tutorPosts;
}

void PostService::loadPosts(const vector<TutorPost>& posts) {
    for (const auto& p : posts) {
        postsById.insert(p.getId(), p);

        Set<string> subjects;
        tutorSubjects.find(p.getTutorId(), subjects);
        string slotKey = p.getSubjectName() + "_" + to_string(p.getGrade()) + "_" + p.getSchedule();
        subjects.insert(slotKey);
        tutorSubjects.insert(p.getTutorId(), subjects);

        if (p.getId() >= nextPostId) {
            nextPostId = p.getId() + 1;
        }
    }
    rebuildIndices();
}
