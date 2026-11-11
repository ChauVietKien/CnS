#include "../../include/models/Application.h"

using namespace std;

Application::Application()
    : id(0), studentId(0), tutorId(0), postId(0),
      name(""), email(""), phone(""), subject(""), className(""),
      tutorName(""), method(""), price(""), address(""), schedule(""),
      note(""), createdAt(""), status("approved") {}

Application::Application(int id, int studentId, int tutorId, int postId,
                         const string& name, const string& email,
                         const string& phone, const string& subject,
                         const string& className, const string& tutorName,
                         const string& method, const string& price,
                         const string& address, const string& schedule,
                         const string& note, const string& createdAt,
                         const string& status)
    : id(id), studentId(studentId), tutorId(tutorId), postId(postId),
      name(name), email(email), phone(phone), subject(subject),
      className(className), tutorName(tutorName), method(method),
      price(price), address(address), schedule(schedule),
      note(note), createdAt(createdAt), status(status) {}

int Application::getId() const { return id; }
void Application::setId(int newId) { id = newId; }

int Application::getStudentId() const { return studentId; }
void Application::setStudentId(int id) { studentId = id; }

int Application::getTutorId() const { return tutorId; }
void Application::setTutorId(int id) { tutorId = id; }

int Application::getPostId() const { return postId; }
void Application::setPostId(int id) { postId = id; }

string Application::getName() const { return name; }
void Application::setName(const string& n) { name = n; }

string Application::getEmail() const { return email; }
void Application::setEmail(const string& e) { email = e; }

string Application::getPhone() const { return phone; }
void Application::setPhone(const string& p) { phone = p; }

string Application::getSubject() const { return subject; }
void Application::setSubject(const string& s) { subject = s; }

string Application::getClassName() const { return className; }
void Application::setClassName(const string& c) { className = c; }

string Application::getTutorName() const { return tutorName; }
void Application::setTutorName(const string& tn) { tutorName = tn; }

string Application::getMethod() const { return method; }
void Application::setMethod(const string& m) { method = m; }

string Application::getPrice() const { return price; }
void Application::setPrice(const string& pr) { price = pr; }

string Application::getAddress() const { return address; }
void Application::setAddress(const string& addr) { address = addr; }

string Application::getSchedule() const { return schedule; }
void Application::setSchedule(const string& sc) { schedule = sc; }

string Application::getNote() const { return note; }
void Application::setNote(const string& n) { note = n; }

string Application::getCreatedAt() const { return createdAt; }
void Application::setCreatedAt(const string& date) { createdAt = date; }

string Application::getStatus() const { return status; }
void Application::setStatus(const string& s) { status = s; }
