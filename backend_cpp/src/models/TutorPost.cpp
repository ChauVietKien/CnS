#include "../../include/models/TutorPost.h"

using namespace std;

TutorPost::TutorPost()
    : id(0), tutorId(0), title(""), description(""), subjectName(""), grade(1),
      tuitionPerHour(0), mode(TeachingMode::ONLINE), schedule(""), createdAt(""),
      status(PostStatus::OPEN), isHiddenByAdmin(false), adminHiddenReason("") {}

TutorPost::TutorPost(int id, int tutorId, const string& title, const string& subjectName,
                     int grade, long long tuitionPerHour, TeachingMode mode)
    : id(id), tutorId(tutorId), title(title), description(""), subjectName(subjectName),
      grade(grade), tuitionPerHour(tuitionPerHour), mode(mode), schedule(""), createdAt(""),
      status(PostStatus::OPEN), isHiddenByAdmin(false), adminHiddenReason("") {}

int TutorPost::getId() const { return id; }
void TutorPost::setId(int newId) { id = newId; }

int TutorPost::getTutorId() const { return tutorId; }
void TutorPost::setTutorId(int id) { tutorId = id; }

string TutorPost::getTitle() const { return title; }
void TutorPost::setTitle(const string& t) { title = t; }

string TutorPost::getDescription() const { return description; }
void TutorPost::setDescription(const string& d) { description = d; }

string TutorPost::getSubjectName() const { return subjectName; }
void TutorPost::setSubjectName(const string& s) { subjectName = s; }

int TutorPost::getGrade() const { return grade; }
void TutorPost::setGrade(int g) { grade = g; }

long long TutorPost::getTuitionPerHour() const { return tuitionPerHour; }
void TutorPost::setTuitionPerHour(long long t) { tuitionPerHour = t; }

TeachingMode TutorPost::getMode() const { return mode; }
void TutorPost::setMode(TeachingMode m) { mode = m; }

const vector<string>& TutorPost::getAreas() const { return areas; }
void TutorPost::setAreas(const vector<string>& a) { areas = a; }
void TutorPost::addArea(const string& area) { areas.push_back(area); }

string TutorPost::getSchedule() const { return schedule; }
void TutorPost::setSchedule(const string& sch) { schedule = sch; }

string TutorPost::getCreatedAt() const { return createdAt; }
void TutorPost::setCreatedAt(const string& date) { createdAt = date; }

PostStatus TutorPost::getStatus() const { return status; }
void TutorPost::setStatus(PostStatus s) { status = s; }

bool TutorPost::getIsHiddenByAdmin() const { return isHiddenByAdmin; }
void TutorPost::setIsHiddenByAdmin(bool hidden) { isHiddenByAdmin = hidden; }

string TutorPost::getAdminHiddenReason() const { return adminHiddenReason; }
void TutorPost::setAdminHiddenReason(const string& reason) { adminHiddenReason = reason; }

string TutorPost::getAddress() const { return address; }
void TutorPost::setAddress(const string& addr) { address = addr; }

string TutorPost::getProof() const { return proof; }
void TutorPost::setProof(const string& p) { proof = p; }

string TutorPost::getClassGrade() const { return classGrade; }
void TutorPost::setClassGrade(const string& c) { classGrade = c; }

bool TutorPost::isVisible() const {
    return status == PostStatus::OPEN && !isHiddenByAdmin;
}
