#ifndef APPLICATION_SERVICE_H
#define APPLICATION_SERVICE_H

#include <vector>
#include <string>
#include <optional>
#include "../models/Application.h"
#include "../dsa/Queue.h"
#include "../dsa/MinHeap.h"
#include "../dsa/HashTable.h"

struct ApplicationSchedule {
    int applicationId;
    std::string timestamp;

    bool operator<(const ApplicationSchedule& other) const {
        return timestamp < other.timestamp;
    }
};

class ApplicationService {
private:
    HashTable<int, Application> applicationsById;
    Queue<int> applicationQueue;
    MinHeap<ApplicationSchedule> scheduleHeap;
    int nextApplicationId;

public:
    ApplicationService();

    int createApplication(int studentId, int tutorId, int postId,
                          const std::string& name, const std::string& email,
                          const std::string& phone, const std::string& subject,
                          const std::string& className, const std::string& tutorName,
                          const std::string& method, const std::string& price,
                          const std::string& address, const std::string& schedule,
                          const std::string& note, const std::string& createdAt = "");

    std::optional<Application> getApplicationById(int id) const;
    std::vector<Application> getApplicationsByStudent(int studentId) const;
    std::vector<Application> getApplicationsByTutor(int tutorId) const;
    std::vector<Application> getApplicationsByPost(int postId) const;
    std::vector<Application> getAllApplications() const;
    bool deleteApplication(int id);

    void loadApplications(const std::vector<Application>& list);
};

#endif
