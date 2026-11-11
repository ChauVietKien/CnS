#include "../../include/services/ApplicationService.h"

using namespace std;

ApplicationService::ApplicationService() : nextApplicationId(1) {}

int ApplicationService::createApplication(int studentId, int tutorId, int postId,
                                          const string& name, const string& email,
                                          const string& phone, const string& subject,
                                          const string& className, const string& tutorName,
                                          const string& method, const string& price,
                                          const string& address, const string& schedule,
                                          const string& note, const string& createdAt) {
    int id = nextApplicationId++;
    string time = createdAt.empty() ? "2026-11-05 18:00" : createdAt;
    Application app(id, studentId, tutorId, postId, name, email, phone, subject, className,
                    tutorName, method, price, address, schedule, note, time, "approved");

    applicationsById.insert(id, app);
    applicationQueue.push(id);
    scheduleHeap.push({id, time});

    return id;
}

optional<Application> ApplicationService::getApplicationById(int id) const {
    Application app;
    if (applicationsById.find(id, app)) {
        return app;
    }
    return nullopt;
}

vector<Application> ApplicationService::getApplicationsByStudent(int studentId) const {
    vector<Application> all = applicationsById.getAllValues();
    vector<Application> res;
    for (const auto& a : all) {
        if (a.getStudentId() == studentId) {
            res.push_back(a);
        }
    }
    return res;
}

vector<Application> ApplicationService::getApplicationsByTutor(int tutorId) const {
    vector<Application> all = applicationsById.getAllValues();
    vector<Application> res;
    for (const auto& a : all) {
        if (a.getTutorId() == tutorId) {
            res.push_back(a);
        }
    }
    return res;
}

vector<Application> ApplicationService::getApplicationsByPost(int postId) const {
    vector<Application> all = applicationsById.getAllValues();
    vector<Application> res;
    for (const auto& a : all) {
        if (a.getPostId() == postId) {
            res.push_back(a);
        }
    }
    return res;
}

vector<Application> ApplicationService::getAllApplications() const {
    return applicationsById.getAllValues();
}

bool ApplicationService::deleteApplication(int id) {
    return applicationsById.remove(id);
}

void ApplicationService::loadApplications(const vector<Application>& list) {
    for (const auto& a : list) {
        applicationsById.insert(a.getId(), a);
        applicationQueue.push(a.getId());
        scheduleHeap.push({a.getId(), a.getCreatedAt()});
        if (a.getId() >= nextApplicationId) {
            nextApplicationId = a.getId() + 1;
        }
    }
}
