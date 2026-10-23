#include "../../include/services/PostService.h"

using namespace std;

PostService::PostService() : nextPostId(1) {}

void PostService::rebuildIndices() {
    vector<TutorPost> posts = postsById.getAllValues();
    tuitionBST.clear();
    for (const auto& p : posts) {
        if (p.isVisible()) {
            subjectTrie.insert(p.getSubjectName(), p.getId());
            tuitionBST.insert(p.getTuitionPerHour(), p.getId());
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

    Set<string> subjects;
    if (tutorSubjects.find(tutorId, subjects)) {
        if (subjects.contains(subjectName)) {
            errorMessage = "Tutor has already posted this subject";
            return false;
        }
    }

    int id = nextPostId++;
    TutorPost post(id, tutorId, title, subjectName, grade, tuitionPerHour, mode);
    post.setDescription(description);
    post.setAreas(areas);
    post.setSchedule(schedule);

    postsById.insert(id, post);

    subjects.insert(subjectName);
    tutorSubjects.insert(tutorId, subjects);

    subjectTrie.insert(subjectName, id);
    tuitionBST.insert(tuitionPerHour, id);

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

vector<string> PostService::suggestSubjects(const string& prefix, int limit) const {
    return subjectTrie.searchPrefix(prefix, limit);
}

vector<TutorPost> PostService::searchBySubject(const string& subjectName) const {
    vector<int> ids = subjectTrie.searchIdsByPrefix(subjectName);
    vector<TutorPost> results;
    for (int id : ids) {
        TutorPost p;
        if (postsById.find(id, p) && p.isVisible()) {
            results.push_back(p);
        }
    }
    return results;
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
            double simulatedScore = 1000.0 / (p.getTuitionPerHour() > 0 ? (p.getTuitionPerHour() / 10000.0) : 1.0);
            heap.push({p.getId(), simulatedScore});
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
        subjects.insert(p.getSubjectName());
        tutorSubjects.insert(p.getTutorId(), subjects);

        if (p.getId() >= nextPostId) {
            nextPostId = p.getId() + 1;
        }
    }
    rebuildIndices();
}
