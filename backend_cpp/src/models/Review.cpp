#include "../../include/models/Review.h"

using namespace std;

Review::Review()
    : id(0), studentId(0), tutorId(0), rating(5), comment(""), createdAt("") {}

Review::Review(int id, int studentId, int tutorId, int rating, const string& comment, const string& createdAt)
    : id(id), studentId(studentId), tutorId(tutorId), rating(rating), comment(comment), createdAt(createdAt) {}

int Review::getId() const { return id; }
void Review::setId(int newId) { id = newId; }

int Review::getStudentId() const { return studentId; }
void Review::setStudentId(int id) { studentId = id; }

int Review::getTutorId() const { return tutorId; }
void Review::setTutorId(int id) { tutorId = id; }

int Review::getRating() const { return rating; }
void Review::setRating(int r) { rating = r; }

string Review::getComment() const { return comment; }
void Review::setComment(const string& c) { comment = c; }

string Review::getCreatedAt() const { return createdAt; }
void Review::setCreatedAt(const string& date) { createdAt = date; }
