#ifndef REVIEW_H
#define REVIEW_H

#include <string>

class Review {
private:
    int id;
    int studentId;
    int tutorId;
    int rating;
    std::string comment;
    std::string createdAt;

public:
    Review();
    Review(int id, int studentId, int tutorId, int rating, const std::string& comment, const std::string& createdAt);

    int getId() const;
    void setId(int newId);

    int getStudentId() const;
    void setStudentId(int id);

    int getTutorId() const;
    void setTutorId(int id);

    int getRating() const;
    void setRating(int r);

    std::string getComment() const;
    void setComment(const std::string& c);

    std::string getCreatedAt() const;
    void setCreatedAt(const std::string& date);
};

#endif
