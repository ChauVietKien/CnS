#ifndef TUTOR_SERVICE_H
#define TUTOR_SERVICE_H

#include <vector>
#include <optional>
#include "../models/TutorProfile.h"
#include "../dsa/HashTable.h"

class TutorService {
private:
    HashTable<int, TutorProfile> profilesByUserId;

public:
    TutorService();

    bool createOrUpdateProfile(const TutorProfile& profile);
    std::optional<TutorProfile> getProfile(int userId) const;
    bool approveProfile(int userId);
    bool rejectProfile(int userId, const std::string& reason);
    std::vector<TutorProfile> getPendingProfiles() const;
    std::vector<TutorProfile> getAllProfiles() const;
    void loadProfiles(const std::vector<TutorProfile>& profiles);
};

#endif
