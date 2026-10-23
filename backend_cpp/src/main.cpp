#include <iostream>
#include "../include/models/User.h"
#include "../include/models/TutorProfile.h"
#include "../include/models/TutorPost.h"
#include "../include/models/Booking.h"
#include "../include/models/Review.h"
#include "../include/services/AuthService.h"
#include "../include/services/TutorService.h"
#include "../include/services/PostService.h"
#include "../include/services/BookingService.h"
#include "../include/storage/FileManager.h"

using namespace std;

int main() {
    AuthService authService;
    TutorService tutorService;
    PostService postService;
    BookingService bookingService;
    FileManager fileManager("data");

    string errMsg;
    authService.registerUser("kien_tutor", "123456", "Chau Viet Kien", "0901234567", "kien@gmail.com", Role::TUTOR, errMsg);
    authService.registerUser("minh_student", "123456", "Duc Minh", "0907654321", "minh@gmail.com", Role::STUDENT, errMsg);
    authService.registerUser("admin_pbl", "adminpass", "Administrator", "0909999999", "admin@gmail.com", Role::ADMIN, errMsg);

    optional<User> loggedInUser = authService.login("kien_tutor", "123456", errMsg);
    if (loggedInUser.has_value()) {
        cout << "Dang nhap thanh cong: " << loggedInUser->getFullName() << endl;

        TutorProfile profile(loggedInUser->getId(), "Kinh nghiem day toan 3 nam", "Dai hoc", "DH Bach Khoa Da Nang", "Cong nghe thong tin", 3);
        profile.setIsApproved(true);
        tutorService.createOrUpdateProfile(profile);

        postService.createPost(loggedInUser->getId(), "Day Toan Lop 12 On Thi Dai Hoc", "Chuyen de Ham so", "Toan hoc", 12, 150000, TeachingMode::ONLINE, {}, "Thu 2, 4, 6", errMsg);
        postService.createPost(loggedInUser->getId(), "Day Tin Hoc Lap Trinh C++", "Co ban den nang cao", "Tin hoc", 10, 200000, TeachingMode::OFFLINE, {"Hai Chau", "Thanh Khe"}, "Thu 3, 5, 7", errMsg);
    }

    cout << "\n--- GOI Y TIM KIEM (TRIE) VOI TU KHOA 'To' ---" << endl;
    vector<string> suggestions = postService.suggestSubjects("To");
    for (const auto& s : suggestions) {
        cout << "- Goi y: " << s << endl;
    }

    cout << "\n--- LOC GIA SU THEO HOC PHI [100000, 180000] (BST) ---" << endl;
    vector<TutorPost> filtered = postService.filterByTuition(100000, 180000);
    for (const auto& p : filtered) {
        cout << "- Mon: " << p.getSubjectName() << " | Hoc phi: " << p.getTuitionPerHour() << " VND/gio" << endl;
    }

    cout << "\n--- TOP GIA SU PHU HOP NHAT (MAX-HEAP) ---" << endl;
    vector<TutorPost> topPosts = postService.getTopRecommended(3);
    for (const auto& p : topPosts) {
        cout << "- Tieu de: " << p.getTitle() << " | Mon: " << p.getSubjectName() << endl;
    }

    int bookingId = bookingService.createBooking(2, 1, 1, "2026-10-25 18:00", "Em muon hoc on thi THPT");
    cout << "\n--- TAO DAT LICH HOC (QUEUE) ---" << endl;
    cout << "Da tao don dat lich voi ID: " << bookingId << endl;

    optional<ScheduleEvent> nearest = bookingService.getNearestUpcomingEvent();
    if (nearest.has_value()) {
        cout << "Lich hoc gan nhat (MIN-HEAP): Don ID " << nearest->bookingId << " vao luc " << nearest->timestamp << endl;
    }

    fileManager.saveUsers(authService.getAllUsers());
    fileManager.saveTutorProfiles(tutorService.getAllProfiles());
    fileManager.saveTutorPosts(postService.getAllActivePosts());
    cout << "\nLuu du lieu he thong thanh cong vao thu muc data/!" << endl;

    return 0;
}
