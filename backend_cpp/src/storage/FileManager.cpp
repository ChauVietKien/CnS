#include "../../include/storage/FileManager.h"
#include <fstream>
#include <sstream>

using namespace std;

FileManager::FileManager(const string& directory) : dataDir(directory) {}

bool FileManager::saveUsers(const vector<User>& users) {
    ofstream file(dataDir + "/users.txt");
    if (!file.is_open()) return false;

    for (const auto& u : users) {
        file << u.getId() << "|"
             << u.getUsername() << "|"
             << u.getPasswordHash() << "|"
             << u.getFullName() << "|"
             << u.getPhone() << "|"
             << u.getEmail() << "|"
             << static_cast<int>(u.getRole()) << "|"
             << u.getIsLocked() << "|"
             << u.getLockReason() << "\n";
    }
    return true;
}

vector<User> FileManager::loadUsers() {
    vector<User> list;
    ifstream file(dataDir + "/users.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string idStr, username, hash, name, phone, email, roleStr, lockedStr, lockReason;

        if (getline(ss, idStr, '|') &&
            getline(ss, username, '|') &&
            getline(ss, hash, '|') &&
            getline(ss, name, '|') &&
            getline(ss, phone, '|') &&
            getline(ss, email, '|') &&
            getline(ss, roleStr, '|') &&
            getline(ss, lockedStr, '|') &&
            getline(ss, lockReason)) {

            User u(stoi(idStr), username, hash, name, phone, email, static_cast<Role>(stoi(roleStr)));
            u.setIsLocked(lockedStr == "1");
            u.setLockReason(lockReason);
            list.push_back(u);
        }
    }
    return list;
}

bool FileManager::saveTutorProfiles(const vector<TutorProfile>& profiles) {
    ofstream file(dataDir + "/tutor_profiles.txt");
    if (!file.is_open()) return false;

    for (const auto& p : profiles) {
        file << p.getUserId() << "|"
             << p.getDateOfBirth() << "|"
             << p.getGender() << "|"
             << p.getAddress() << "|"
             << p.getZalo() << "|"
             << p.getBio() << "|"
             << p.getQualification() << "|"
             << p.getWorkplace() << "|"
             << p.getMajor() << "|"
             << p.getExperienceYears() << "|"
             << p.getIsApproved() << "|"
             << p.getRejectReason() << "\n";
    }
    return true;
}

vector<TutorProfile> FileManager::loadTutorProfiles() {
    vector<TutorProfile> list;
    ifstream file(dataDir + "/tutor_profiles.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string idStr, dob, gender, addr, zalo, bio, qual, workplace, major, expStr, approvedStr, rejectReason;

        if (getline(ss, idStr, '|') &&
            getline(ss, dob, '|') &&
            getline(ss, gender, '|') &&
            getline(ss, addr, '|') &&
            getline(ss, zalo, '|') &&
            getline(ss, bio, '|') &&
            getline(ss, qual, '|') &&
            getline(ss, workplace, '|') &&
            getline(ss, major, '|') &&
            getline(ss, expStr, '|') &&
            getline(ss, approvedStr, '|') &&
            getline(ss, rejectReason)) {

            TutorProfile p(stoi(idStr), bio, qual, workplace, major, stoi(expStr));
            p.setDateOfBirth(dob);
            p.setGender(gender);
            p.setAddress(addr);
            p.setZalo(zalo);
            p.setIsApproved(approvedStr == "1");
            p.setRejectReason(rejectReason);
            list.push_back(p);
        }
    }
    return list;
}

bool FileManager::saveTutorPosts(const vector<TutorPost>& posts) {
    ofstream file(dataDir + "/tutor_posts.txt");
    if (!file.is_open()) return false;

    for (const auto& p : posts) {
        file << p.getId() << "|"
             << p.getTutorId() << "|"
             << p.getTitle() << "|"
             << p.getDescription() << "|"
             << p.getSubjectName() << "|"
             << p.getGrade() << "|"
             << p.getTuitionPerHour() << "|"
             << static_cast<int>(p.getMode()) << "|"
             << p.getSchedule() << "|"
             << p.getCreatedAt() << "|"
             << static_cast<int>(p.getStatus()) << "|"
             << p.getIsHiddenByAdmin() << "|"
             << p.getAdminHiddenReason() << "\n";
    }
    return true;
}

vector<TutorPost> FileManager::loadTutorPosts() {
    vector<TutorPost> list;
    ifstream file(dataDir + "/tutor_posts.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string idStr, tutorIdStr, title, desc, subject, gradeStr, tuitionStr, modeStr, sched, created, statusStr, hiddenStr, hiddenReason;

        if (getline(ss, idStr, '|') &&
            getline(ss, tutorIdStr, '|') &&
            getline(ss, title, '|') &&
            getline(ss, desc, '|') &&
            getline(ss, subject, '|') &&
            getline(ss, gradeStr, '|') &&
            getline(ss, tuitionStr, '|') &&
            getline(ss, modeStr, '|') &&
            getline(ss, sched, '|') &&
            getline(ss, created, '|') &&
            getline(ss, statusStr, '|') &&
            getline(ss, hiddenStr, '|') &&
            getline(ss, hiddenReason)) {

            TutorPost p(stoi(idStr), stoi(tutorIdStr), title, subject, stoi(gradeStr), stoll(tuitionStr), static_cast<TeachingMode>(stoi(modeStr)));
            p.setDescription(desc);
            p.setSchedule(sched);
            p.setCreatedAt(created);
            p.setStatus(static_cast<PostStatus>(stoi(statusStr)));
            p.setIsHiddenByAdmin(hiddenStr == "1");
            p.setAdminHiddenReason(hiddenReason);
            list.push_back(p);
        }
    }
    return list;
}

bool FileManager::saveBookings(const vector<Booking>& bookings) {
    ofstream file(dataDir + "/bookings.txt");
    if (!file.is_open()) return false;

    for (const auto& b : bookings) {
        file << b.getId() << "|"
             << b.getStudentId() << "|"
             << b.getTutorId() << "|"
             << b.getPostId() << "|"
             << b.getNotes() << "|"
             << b.getScheduledTime() << "|"
             << b.getCreatedAt() << "|"
             << static_cast<int>(b.getStatus()) << "\n";
    }
    return true;
}

vector<Booking> FileManager::loadBookings() {
    vector<Booking> list;
    ifstream file(dataDir + "/bookings.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string idStr, studentIdStr, tutorIdStr, postIdStr, notes, sched, created, statusStr;

        if (getline(ss, idStr, '|') &&
            getline(ss, studentIdStr, '|') &&
            getline(ss, tutorIdStr, '|') &&
            getline(ss, postIdStr, '|') &&
            getline(ss, notes, '|') &&
            getline(ss, sched, '|') &&
            getline(ss, created, '|') &&
            getline(ss, statusStr)) {

            Booking b(stoi(idStr), stoi(studentIdStr), stoi(tutorIdStr), stoi(postIdStr), sched);
            b.setNotes(notes);
            b.setCreatedAt(created);
            b.setStatus(static_cast<BookingStatus>(stoi(statusStr)));
            list.push_back(b);
        }
    }
    return list;
}

bool FileManager::saveReviews(const vector<Review>& reviews) {
    ofstream file(dataDir + "/reviews.txt");
    if (!file.is_open()) return false;

    for (const auto& r : reviews) {
        file << r.getId() << "|"
             << r.getStudentId() << "|"
             << r.getTutorId() << "|"
             << r.getRating() << "|"
             << r.getComment() << "|"
             << r.getCreatedAt() << "\n";
    }
    return true;
}

vector<Review> FileManager::loadReviews() {
    vector<Review> list;
    ifstream file(dataDir + "/reviews.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        stringstream ss(line);
        string idStr, studentIdStr, tutorIdStr, ratingStr, comment, created;

        if (getline(ss, idStr, '|') &&
            getline(ss, studentIdStr, '|') &&
            getline(ss, tutorIdStr, '|') &&
            getline(ss, ratingStr, '|') &&
            getline(ss, comment, '|') &&
            getline(ss, created)) {

            Review r(stoi(idStr), stoi(studentIdStr), stoi(tutorIdStr), stoi(ratingStr), comment, created);
            list.push_back(r);
        }
    }
    return list;
}
