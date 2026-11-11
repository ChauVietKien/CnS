#include "../../include/services/TutorService.h"

using namespace std;

TutorService::TutorService() : nextReviewId(1) {}

bool TutorService::createOrUpdateProfile(const TutorProfile& profile) {
    profilesByUserId.insert(profile.getUserId(), profile);
    return true;
}

optional<TutorProfile> TutorService::getProfile(int userId) const {
    TutorProfile p;
    if (profilesByUserId.find(userId, p)) {
        return p;
    }
    return nullopt;
}

bool TutorService::approveProfile(int userId) {
    TutorProfile p;
    if (profilesByUserId.find(userId, p)) {
        p.setIsApproved(true);
        p.setRejectReason("");
        profilesByUserId.insert(userId, p);
        return true;
    }
    return false;
}

bool TutorService::rejectProfile(int userId, const string& reason) {
    TutorProfile p;
    if (profilesByUserId.find(userId, p)) {
        p.setIsApproved(false);
        p.setRejectReason(reason);
        profilesByUserId.insert(userId, p);
        return true;
    }
    return false;
}

vector<TutorProfile> TutorService::getPendingProfiles() const {
    vector<TutorProfile> all = profilesByUserId.getAllValues();
    vector<TutorProfile> pending;
    for (const auto& p : all) {
        if (!p.getIsApproved() && p.getRejectReason().empty()) {
            pending.push_back(p);
        }
    }
    return pending;
}

vector<TutorProfile> TutorService::getAllProfiles() const {
    return profilesByUserId.getAllValues();
}

void TutorService::loadProfiles(const vector<TutorProfile>& profiles) {
    for (const auto& p : profiles) {
        profilesByUserId.insert(p.getUserId(), p);
    }
}

void TutorService::addReview(const Review& r) {
    Review copy = r;
    if (copy.getId() <= 0) {
        copy.setId(nextReviewId++);
    } else if (copy.getId() >= nextReviewId) {
        nextReviewId = copy.getId() + 1;
    }
    reviews.pushFront(copy);
}

vector<Review> TutorService::getReviewsByTutor(int tutorId) const {
    vector<Review> all = reviews.toVector();
    vector<Review> res;
    for (const auto& r : all) {
        if (r.getTutorId() == tutorId) {
            res.push_back(r);
        }
    }
    return res;
}

vector<Review> TutorService::getAllReviews() const {
    return reviews.toVector();
}

void TutorService::loadReviews(const vector<Review>& rList) {
    reviews.clear();
    for (const auto& r : rList) {
        reviews.pushBack(r);
        if (r.getId() >= nextReviewId) {
            nextReviewId = r.getId() + 1;
        }
    }
}

double TutorService::getAverageRating(int tutorId) const {
    vector<Review> all = reviews.toVector();
    int count = 0;
    double sum = 0.0;
    for (const auto& r : all) {
        if (r.getTutorId() == tutorId) {
            sum += r.getRating();
            count++;
        }
    }
    if (count == 0) return 5.0;
    return (double)((int)((sum / count) * 10 + 0.5)) / 10.0;
}

int TutorService::getReviewCount(int tutorId) const {
    vector<Review> all = reviews.toVector();
    int count = 0;
    for (const auto& r : all) {
        if (r.getTutorId() == tutorId) {
            count++;
        }
    }
    return count;
}
