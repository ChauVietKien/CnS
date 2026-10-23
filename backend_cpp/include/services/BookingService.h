#ifndef BOOKING_SERVICE_H
#define BOOKING_SERVICE_H

#include <vector>
#include <string>
#include <optional>
#include "../models/Booking.h"
#include "../dsa/Queue.h"
#include "../dsa/MinHeap.h"
#include "../dsa/HashTable.h"

struct ScheduleEvent {
    int bookingId;
    std::string timestamp;

    bool operator<(const ScheduleEvent& other) const {
        return timestamp < other.timestamp;
    }
};

class BookingService {
private:
    HashTable<int, Booking> bookingsById;
    Queue<int> pendingBookingsQueue;
    MinHeap<ScheduleEvent> upcomingEventsHeap;
    int nextBookingId;

public:
    BookingService();

    int createBooking(int studentId, int tutorId, int postId, 
                      const std::string& scheduledTime, const std::string& notes);

    bool acceptBooking(int bookingId, int tutorId);
    bool rejectBooking(int bookingId, int tutorId);
    std::optional<Booking> getBookingById(int bookingId) const;
    std::vector<Booking> getBookingsByStudent(int studentId) const;
    std::vector<Booking> getBookingsByTutor(int tutorId) const;
    std::optional<ScheduleEvent> getNearestUpcomingEvent();
    void loadBookings(const std::vector<Booking>& bookings);
};

#endif
