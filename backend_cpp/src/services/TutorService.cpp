#include "../../include/services/TutorService.h"

using namespace std;

TutorService::TutorService() {}

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
