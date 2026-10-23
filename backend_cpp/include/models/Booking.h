#ifndef BOOKING_H
#define BOOKING_H

#include <string>

enum class BookingStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    COMPLETED
};

class Booking {
private:
    int id;
    int studentId;
    int tutorId;
    int postId;
    std::string notes;
    std::string scheduledTime;
    std::string createdAt;
    BookingStatus status;

public:
    Booking();
    Booking(int id, int studentId, int tutorId, int postId, const std::string& scheduledTime);

    int getId() const;
    void setId(int newId);

    int getStudentId() const;
    void setStudentId(int id);

    int getTutorId() const;
    void setTutorId(int id);

    int getPostId() const;
    void setPostId(int id);

    std::string getNotes() const;
    void setNotes(const std::string& n);

    std::string getScheduledTime() const;
    void setScheduledTime(const std::string& t);

    std::string getCreatedAt() const;
    void setCreatedAt(const std::string& date);

    BookingStatus getStatus() const;
    void setStatus(BookingStatus s);
};

#endif
