#ifndef TUTOR_PROFILE_H
#define TUTOR_PROFILE_H

#include <string>
#include <vector>

class TutorProfile {
private:
    int userId;
    std::string dateOfBirth;
    std::string gender;
    std::string address;
    std::string zalo;
    std::string bio;
    std::string qualification;
    std::string workplace;
    std::string major;
    int experienceYears;
    bool isApproved;
    std::string rejectReason;
    std::vector<std::string> evidenceImages;

public:
    TutorProfile();
    TutorProfile(int userId, const std::string& bio, const std::string& qualification,
                 const std::string& workplace, const std::string& major, int experienceYears);

    int getUserId() const;
    void setUserId(int id);

    std::string getDateOfBirth() const;
    void setDateOfBirth(const std::string& dob);

    std::string getGender() const;
    void setGender(const std::string& g);

    std::string getAddress() const;
    void setAddress(const std::string& addr);

    std::string getZalo() const;
    void setZalo(const std::string& z);

    std::string getBio() const;
    void setBio(const std::string& b);

    std::string getQualification() const;
    void setQualification(const std::string& q);

    std::string getWorkplace() const;
    void setWorkplace(const std::string& wp);

    std::string getMajor() const;
    void setMajor(const std::string& m);

    int getExperienceYears() const;
    void setExperienceYears(int exp);

    bool getIsApproved() const;
    void setIsApproved(bool approved);

    std::string getRejectReason() const;
    void setRejectReason(const std::string& reason);

    const std::vector<std::string>& getEvidenceImages() const;
    void addEvidenceImage(const std::string& imagePath);
};

#endif
