#include "../../include/services/BookingService.h"

using namespace std;

BookingService::BookingService() : nextBookingId(1) {}

int BookingService::createBooking(int studentId, int tutorId, int postId, 
                                  const string& scheduledTime, const string& notes) {
    int id = nextBookingId++;
    Booking b(id, studentId, tutorId, postId, scheduledTime);
    b.setNotes(notes);

    bookingsById.insert(id, b);
    pendingBookingsQueue.push(id);
    upcomingEventsHeap.push({id, scheduledTime});

    return id;
}

bool BookingService::acceptBooking(int bookingId, int tutorId) {
    Booking b;
    if (bookingsById.find(bookingId, b)) {
        if (b.getTutorId() == tutorId) {
            b.setStatus(BookingStatus::ACCEPTED);
            bookingsById.insert(bookingId, b);
            return true;
        }
    }
    return false;
}

bool BookingService::rejectBooking(int bookingId, int tutorId) {
    Booking b;
    if (bookingsById.find(bookingId, b)) {
        if (b.getTutorId() == tutorId) {
            b.setStatus(BookingStatus::REJECTED);
            bookingsById.insert(bookingId, b);
            return true;
        }
    }
    return false;
}

optional<Booking> BookingService::getBookingById(int bookingId) const {
    Booking b;
    if (bookingsById.find(bookingId, b)) {
        return b;
    }
    return nullopt;
}

vector<Booking> BookingService::getBookingsByStudent(int studentId) const {
    vector<Booking> all = bookingsById.getAllValues();
    vector<Booking> res;
    for (const auto& b : all) {
        if (b.getStudentId() == studentId) {
            res.push_back(b);
        }
    }
    return res;
}

vector<Booking> BookingService::getBookingsByTutor(int tutorId) const {
    vector<Booking> all = bookingsById.getAllValues();
    vector<Booking> res;
    for (const auto& b : all) {
        if (b.getTutorId() == tutorId) {
            res.push_back(b);
        }
    }
    return res;
}

optional<ScheduleEvent> BookingService::getNearestUpcomingEvent() {
    if (!upcomingEventsHeap.empty()) {
        return upcomingEventsHeap.top();
    }
    return nullopt;
}

void BookingService::loadBookings(const vector<Booking>& bookings) {
    for (const auto& b : bookings) {
        bookingsById.insert(b.getId(), b);
        if (b.getStatus() == BookingStatus::PENDING) {
            pendingBookingsQueue.push(b.getId());
        }
        upcomingEventsHeap.push({b.getId(), b.getScheduledTime()});
        if (b.getId() >= nextBookingId) {
            nextBookingId = b.getId() + 1;
        }
    }
}
