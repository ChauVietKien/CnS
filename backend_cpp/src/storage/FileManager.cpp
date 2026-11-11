#include "../../include/storage/FileManager.h"
#include <fstream>
#include <sstream>
#include <cctype>

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
        vector<string> parts;
        stringstream ss(line);
        string item;
        while (getline(ss, item, '|')) {
            parts.push_back(item);
        }

        if (parts.size() >= 6) {
            try {
                int id = stoi(parts[0]);
                string username = parts[1];
                string hash = parts[2];
                string name = parts[3];
                string phone = parts[4];
                string email = parts[5];
                Role role = Role::STUDENT;
                if (parts.size() > 6) {
                    if (parts[6] == "TUTOR" || parts[6] == "1") role = Role::TUTOR;
                    else if (parts[6] == "ADMIN" || parts[6] == "2") role = Role::ADMIN;
                    else {
                        try { role = static_cast<Role>(stoi(parts[6])); } catch (...) {}
                    }
                }
                bool locked = (parts.size() > 7 && parts[7] == "1");
                string lockReason = (parts.size() > 8) ? parts[8] : "";

                User u(id, username, hash, name, phone, email, role);
                u.setIsLocked(locked);
                u.setLockReason(lockReason);
                list.push_back(u);
            } catch (...) {}
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
        vector<string> parts;
        stringstream ss(line);
        string item;
        while (getline(ss, item, '|')) {
            parts.push_back(item);
        }

        if (parts.size() >= 6) {
            try {
                if (parts.size() == 6) {
                    int id = stoi(parts[0]);
                    string bio = parts[1];
                    string qual = parts[2];
                    string workplace = parts[3];
                    string major = parts[4];
                    int exp = stoi(parts[5]);
                    TutorProfile p(id, bio, qual, workplace, major, exp);
                    p.setIsApproved(true);
                    list.push_back(p);
                } else if (parts.size() >= 12) {
                    int id = stoi(parts[0]);
                    string dob = parts[1];
                    string gender = parts[2];
                    string addr = parts[3];
                    string zalo = parts[4];
                    string bio = parts[5];
                    string qual = parts[6];
                    string workplace = parts[7];
                    string major = parts[8];
                    int exp = stoi(parts[9]);
                    bool approved = (parts[10] == "1");
                    string reason = parts[11];
                    TutorProfile p(id, bio, qual, workplace, major, exp);
                    p.setDateOfBirth(dob);
                    p.setGender(gender);
                    p.setAddress(addr);
                    p.setZalo(zalo);
                    p.setIsApproved(approved);
                    p.setRejectReason(reason);
                    list.push_back(p);
                }
            } catch (...) {}
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
             << p.getSubjectName() << "|"
             << p.getClassGrade() << "|"
             << p.getDescription() << "|"
             << (p.getMode() == TeachingMode::ONLINE ? "Online" : "Offline") << "|"
             << p.getTuitionPerHour() << "|"
             << p.getAddress() << "|"
             << p.getProof() << "|"
             << p.getSchedule() << "\n";
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
        vector<string> parts;
        stringstream ss(line);
        string item;
        while (getline(ss, item, '|')) {
            parts.push_back(item);
        }

        if (parts.size() >= 10) {
            try {
                if (parts.size() == 10) {
                    int id = stoi(parts[0]);
                    int tutorId = stoi(parts[1]);
                    string subject = parts[2];
                    string classGrade = parts[3];
                    string desc = parts[4];
                    TeachingMode mode = (parts[5] == "Online" ? TeachingMode::ONLINE : TeachingMode::OFFLINE);
                    long long tuition = stoll(parts[6]);
                    string address = parts[7];
                    string proof = parts[8];
                    string sched = parts[9];

                    int grade = 12;
                    for (size_t i = 0; i < classGrade.size(); ++i) {
                        if (isdigit((unsigned char)classGrade[i])) {
                            try { grade = stoi(classGrade.substr(i)); } catch (...) {}
                            break;
                        }
                    }

                    TutorPost p(id, tutorId, subject, subject, grade, tuition, mode);
                    p.setDescription(desc);
                    p.setClassGrade(classGrade);
                    p.setAddress(address);
                    p.setProof(proof);
                    p.setSchedule(sched);
                    p.setStatus(PostStatus::OPEN);
                    list.push_back(p);
                } else if (parts.size() >= 13) {
                    int id = stoi(parts[0]);
                    int tutorId = stoi(parts[1]);
                    string title = parts[2];
                    string desc = parts[3];
                    string subject = parts[4];
                    int grade = stoi(parts[5]);
                    long long tuition = stoll(parts[6]);
                    TeachingMode mode = static_cast<TeachingMode>(stoi(parts[7]));
                    string sched = parts[8];
                    string created = parts[9];
                    PostStatus status = static_cast<PostStatus>(stoi(parts[10]));
                    bool hidden = (parts[11] == "1");
                    string hiddenReason = parts[12];

                    TutorPost p(id, tutorId, title, subject, grade, tuition, mode);
                    p.setDescription(desc);
                    p.setSchedule(sched);
                    p.setCreatedAt(created);
                    p.setStatus(status);
                    p.setIsHiddenByAdmin(hidden);
                    p.setAdminHiddenReason(hiddenReason);
                    list.push_back(p);
                }
            } catch (...) {}
        }
    }
    return list;
}

bool FileManager::saveApplications(const vector<Application>& applications) {
    ofstream file(dataDir + "/applications.txt");
    if (!file.is_open()) return false;

    for (const auto& a : applications) {
        file << a.getId() << "|"
             << a.getStudentId() << "|"
             << a.getTutorId() << "|"
             << a.getPostId() << "|"
             << a.getName() << "|"
             << a.getEmail() << "|"
             << a.getPhone() << "|"
             << a.getSubject() << "|"
             << a.getClassName() << "|"
             << a.getTutorName() << "|"
             << a.getMethod() << "|"
             << a.getPrice() << "|"
             << a.getAddress() << "|"
             << a.getSchedule() << "|"
             << a.getNote() << "|"
             << a.getCreatedAt() << "|"
             << a.getStatus() << "\n";
    }
    return true;
}

vector<Application> FileManager::loadApplications() {
    vector<Application> list;
    ifstream file(dataDir + "/applications.txt");
    if (!file.is_open()) return list;

    string line;
    while (getline(file, line)) {
        if (line.empty()) continue;
        vector<string> parts;
        stringstream ss(line);
        string item;
        while (getline(ss, item, '|')) {
            parts.push_back(item);
        }

        if (parts.size() >= 16) {
            // Định dạng chi tiết đầy đủ (Rich format 17 trường)
            try {
                int id = stoi(parts[0]);
                int studentId = stoi(parts[1]);
                int tutorId = stoi(parts[2]);
                int postId = stoi(parts[3]);
                string name = parts[4];
                string email = parts[5];
                string phone = parts[6];
                string subject = parts[7];
                string className = parts[8];
                string tutorName = parts[9];
                string method = parts[10];
                string price = parts[11];
                string address = parts[12];
                string schedule = parts[13];
                string note = parts[14];
                string createdAt = parts[15];
                string status = (parts.size() > 16) ? parts[16] : "approved";

                Application a(id, studentId, tutorId, postId, name, email, phone, subject,
                              className, tutorName, method, price, address, schedule, note, createdAt, status);
                list.push_back(a);
            } catch (...) {}
        } else if (parts.size() >= 10) {
            // Định dạng 11 trường cũ
            try {
                int id = stoi(parts[0]);
                int studentId = stoi(parts[1]);
                int tutorId = stoi(parts[2]);
                int postId = stoi(parts[3]);
                string name = parts[4];
                string email = parts[5];
                string phone = parts[6];
                string className = parts[7];
                string note = parts[8];
                string createdAt = parts[9];
                string status = (parts.size() > 10) ? parts[10] : "approved";

                Application a(id, studentId, tutorId, postId, name, email, phone, "Toán học",
                              className, "Châu Việt Kiên", "Online", "200000 đ/buổi", "Đà Nẵng", "Thứ 2 & 4", note, createdAt, status);
                list.push_back(a);
            } catch (...) {}
        } else if (parts.size() >= 6) {
            // Backward compatibility
            try {
                int id = stoi(parts[0]);
                int studentId = stoi(parts[1]);
                int tutorId = stoi(parts[2]);
                int postId = stoi(parts[3]);
                string time = parts[4];
                string note = (parts.size() > 6) ? parts[6] : "Dang ky hoc";
                Application a(id, studentId, tutorId, postId, "Đức Minh", "minh@gmail.com", "0907654321", "Toán học",
                              "12", "Châu Việt Kiên", "Online", "200000 đ/buổi", "Đà Nẵng", "Thứ 2 & 4", note, time, "approved");
                list.push_back(a);
            } catch (...) {}
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
        vector<string> parts;
        stringstream ss(line);
        string item;
        while (getline(ss, item, '|')) {
            parts.push_back(item);
        }

        if (parts.size() >= 6) {
            try {
                int id = stoi(parts[0]);
                int studentId = stoi(parts[1]);
                int tutorId = stoi(parts[2]);
                int rating = stoi(parts[3]);
                string comment = parts[4];
                string created = parts[5];
                Review r(id, studentId, tutorId, rating, comment, created);
                list.push_back(r);
            } catch (...) {}
        }
    }
    return list;
}
