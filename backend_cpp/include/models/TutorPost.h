#ifndef TUTOR_POST_H
#define TUTOR_POST_H

#include <string>
#include <vector>

enum class TeachingMode {
    ONLINE,
    OFFLINE
};

enum class PostStatus {
    OPEN,
    PAUSED,
    ARCHIVED
};

class TutorPost {
private:
    int id;
    int tutorId;
    std::string title;
    std::string description;
    std::string subjectName;
    int grade;
    long long tuitionPerHour;
    TeachingMode mode;
    std::vector<std::string> areas;
    std::string schedule;
    std::string createdAt;
    PostStatus status;
    bool isHiddenByAdmin;
    std::string adminHiddenReason;
    std::string address;
    std::string proof;
    std::string classGrade;

public:
    TutorPost();
    TutorPost(int id, int tutorId, const std::string& title, const std::string& subjectName,
              int grade, long long tuitionPerHour, TeachingMode mode);

    int getId() const;
    void setId(int newId);

    int getTutorId() const;
    void setTutorId(int id);

    std::string getTitle() const;
    void setTitle(const std::string& t);

    std::string getDescription() const;
    void setDescription(const std::string& d);

    std::string getSubjectName() const;
    void setSubjectName(const std::string& s);

    int getGrade() const;
    void setGrade(int g);

    long long getTuitionPerHour() const;
    void setTuitionPerHour(long long t);

    TeachingMode getMode() const;
    void setMode(TeachingMode m);

    const std::vector<std::string>& getAreas() const;
    void setAreas(const std::vector<std::string>& a);
    void addArea(const std::string& area);

    std::string getSchedule() const;
    void setSchedule(const std::string& sch);

    std::string getCreatedAt() const;
    void setCreatedAt(const std::string& date);

    PostStatus getStatus() const;
    void setStatus(PostStatus s);

    bool getIsHiddenByAdmin() const;
    void setIsHiddenByAdmin(bool hidden);

    std::string getAdminHiddenReason() const;
    void setAdminHiddenReason(const std::string& reason);

    bool isVisible() const;

    std::string getAddress() const;
    void setAddress(const std::string& addr);

    std::string getProof() const;
    void setProof(const std::string& p);

    std::string getClassGrade() const;
    void setClassGrade(const std::string& c);
};

#endif
