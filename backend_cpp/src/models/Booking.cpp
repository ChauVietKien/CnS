#include "../../include/models/Booking.h"

using namespace std;

Booking::Booking()
    : id(0), studentId(0), tutorId(0), postId(0), notes(""), scheduledTime(""),
      createdAt(""), status(BookingStatus::PENDING) {}

Booking::Booking(int id, int studentId, int tutorId, int postId, const string& scheduledTime)
    : id(id), studentId(studentId), tutorId(tutorId), postId(postId), notes(""),
      scheduledTime(scheduledTime), createdAt(""), status(BookingStatus::PENDING) {}

int Booking::getId() const { return id; }
void Booking::setId(int newId) { id = newId; }

int Booking::getStudentId() const { return studentId; }
void Booking::setStudentId(int id) { studentId = id; }

int Booking::getTutorId() const { return tutorId; }
void Booking::setTutorId(int id) { tutorId = id; }

int Booking::getPostId() const { return postId; }
void Booking::setPostId(int id) { postId = id; }

string Booking::getNotes() const { return notes; }
void Booking::setNotes(const string& n) { notes = n; }

string Booking::getScheduledTime() const { return scheduledTime; }
void Booking::setScheduledTime(const string& t) { scheduledTime = t; }

string Booking::getCreatedAt() const { return createdAt; }
void Booking::setCreatedAt(const string& date) { createdAt = date; }

BookingStatus Booking::getStatus() const { return status; }
void Booking::setStatus(BookingStatus s) { status = s; }
