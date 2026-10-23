#include "../../include/models/TutorProfile.h"

using namespace std;

TutorProfile::TutorProfile()
    : userId(0), dateOfBirth(""), gender(""), address(""), zalo(""), bio(""),
      qualification(""), workplace(""), major(""), experienceYears(0),
      isApproved(false), rejectReason("") {}

TutorProfile::TutorProfile(int userId, const string& bio, const string& qualification,
                           const string& workplace, const string& major, int experienceYears)
    : userId(userId), dateOfBirth(""), gender(""), address(""), zalo(""), bio(bio),
      qualification(qualification), workplace(workplace), major(major),
      experienceYears(experienceYears), isApproved(false), rejectReason("") {}

int TutorProfile::getUserId() const { return userId; }
void TutorProfile::setUserId(int id) { userId = id; }

string TutorProfile::getDateOfBirth() const { return dateOfBirth; }
void TutorProfile::setDateOfBirth(const string& dob) { dateOfBirth = dob; }

string TutorProfile::getGender() const { return gender; }
void TutorProfile::setGender(const string& g) { gender = g; }

string TutorProfile::getAddress() const { return address; }
void TutorProfile::setAddress(const string& addr) { address = addr; }

string TutorProfile::getZalo() const { return zalo; }
void TutorProfile::setZalo(const string& z) { zalo = z; }

string TutorProfile::getBio() const { return bio; }
void TutorProfile::setBio(const string& b) { bio = b; }

string TutorProfile::getQualification() const { return qualification; }
void TutorProfile::setQualification(const string& q) { qualification = q; }

string TutorProfile::getWorkplace() const { return workplace; }
void TutorProfile::setWorkplace(const string& wp) { workplace = wp; }

string TutorProfile::getMajor() const { return major; }
void TutorProfile::setMajor(const string& m) { major = m; }

int TutorProfile::getExperienceYears() const { return experienceYears; }
void TutorProfile::setExperienceYears(int exp) { experienceYears = exp; }

bool TutorProfile::getIsApproved() const { return isApproved; }
void TutorProfile::setIsApproved(bool approved) { isApproved = approved; }

string TutorProfile::getRejectReason() const { return rejectReason; }
void TutorProfile::setRejectReason(const string& reason) { rejectReason = reason; }

const vector<string>& TutorProfile::getEvidenceImages() const { return evidenceImages; }
void TutorProfile::addEvidenceImage(const string& imagePath) { evidenceImages.push_back(imagePath); }
