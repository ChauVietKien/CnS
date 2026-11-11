#ifndef TUTOR_SERVICE_H
#define TUTOR_SERVICE_H

#include <vector>
#include <optional>
#include "../models/TutorProfile.h"
#include "../models/Review.h"
#include "../dsa/HashTable.h"
#include "../dsa/DoublyLinkedList.h"

class TutorService {
private:
    HashTable<int, TutorProfile> profilesByUserId;
    DoublyLinkedList<Review> reviews;
    int nextReviewId;

public:
    TutorService();

    bool createOrUpdateProfile(const TutorProfile& profile);
    std::optional<TutorProfile> getProfile(int userId) const;
    bool approveProfile(int userId);
    bool rejectProfile(int userId, const std::string& reason);
    std::vector<TutorProfile> getPendingProfiles() const;
    std::vector<TutorProfile> getAllProfiles() const;
    void loadProfiles(const std::vector<TutorProfile>& profiles);

    // Reviews (DoublyLinkedList)
    void addReview(const Review& r);
    std::vector<Review> getReviewsByTutor(int tutorId) const;
    std::vector<Review> getAllReviews() const;
    void loadReviews(const std::vector<Review>& rList);
    double getAverageRating(int tutorId) const;
    int getReviewCount(int tutorId) const;
};

#endif
