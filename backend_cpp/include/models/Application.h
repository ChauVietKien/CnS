#ifndef APPLICATION_H
#define APPLICATION_H

#include <string>

class Application {
private:
    int id;
    int studentId;
    int tutorId;
    int postId;
    std::string name;
    std::string email;
    std::string phone;
    std::string subject;
    std::string className;
    std::string tutorName;
    std::string method;
    std::string price;
    std::string address;
    std::string schedule;
    std::string note;
    std::string createdAt;
    std::string status; // "approved" - tự động duyệt

public:
    Application();
    Application(int id, int studentId, int tutorId, int postId,
                const std::string& name, const std::string& email,
                const std::string& phone, const std::string& subject,
                const std::string& className, const std::string& tutorName,
                const std::string& method, const std::string& price,
                const std::string& address, const std::string& schedule,
                const std::string& note, const std::string& createdAt = "",
                const std::string& status = "approved");

    int getId() const;
    void setId(int newId);

    int getStudentId() const;
    void setStudentId(int id);

    int getTutorId() const;
    void setTutorId(int id);

    int getPostId() const;
    void setPostId(int id);

    std::string getName() const;
    void setName(const std::string& n);

    std::string getEmail() const;
    void setEmail(const std::string& e);

    std::string getPhone() const;
    void setPhone(const std::string& p);

    std::string getSubject() const;
    void setSubject(const std::string& s);

    std::string getClassName() const;
    void setClassName(const std::string& c);

    std::string getTutorName() const;
    void setTutorName(const std::string& tn);

    std::string getMethod() const;
    void setMethod(const std::string& m);

    std::string getPrice() const;
    void setPrice(const std::string& pr);

    std::string getAddress() const;
    void setAddress(const std::string& addr);

    std::string getSchedule() const;
    void setSchedule(const std::string& sc);

    std::string getNote() const;
    void setNote(const std::string& n);

    std::string getCreatedAt() const;
    void setCreatedAt(const std::string& date);

    std::string getStatus() const;
    void setStatus(const std::string& s);
};

#endif
