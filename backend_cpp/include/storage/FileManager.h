#ifndef FILE_MANAGER_H
#define FILE_MANAGER_H

#include <string>
#include <vector>
#include "../models/User.h"
#include "../models/TutorProfile.h"
#include "../models/TutorPost.h"
#include "../models/Booking.h"
#include "../models/Review.h"

class FileManager {
private:
    std::string dataDir;

public:
    FileManager(const std::string& directory = "data");

    bool saveUsers(const std::vector<User>& users);
    std::vector<User> loadUsers();

    bool saveTutorProfiles(const std::vector<TutorProfile>& profiles);
    std::vector<TutorProfile> loadTutorProfiles();

    bool saveTutorPosts(const std::vector<TutorPost>& posts);
    std::vector<TutorPost> loadTutorPosts();

    bool saveBookings(const std::vector<Booking>& bookings);
    std::vector<Booking> loadBookings();

    bool saveReviews(const std::vector<Review>& reviews);
    std::vector<Review> loadReviews();
};

#endif
