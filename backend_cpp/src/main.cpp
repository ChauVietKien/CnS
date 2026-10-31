#include <iostream>
#include <cstdlib>
#include "../include/services/AuthService.h"
#include "../include/services/TutorService.h"
#include "../include/services/PostService.h"
#include "../include/services/BookingService.h"
#include "../include/storage/FileManager.h"
#include "../include/server/HttpServer.h"

using namespace std;

int main() {
    AuthService authService;
    TutorService tutorService;
    PostService postService;
    BookingService bookingService;
    FileManager fileManager("data");

    // 1. Nạp dữ liệu từ thư mục data/
    auto users = fileManager.loadUsers();
    auto profiles = fileManager.loadTutorProfiles();
    auto posts = fileManager.loadTutorPosts();
    auto bookings = fileManager.loadBookings();

    if (!users.empty() || !posts.empty()) {
        authService.loadUsers(users);
        tutorService.loadProfiles(profiles);
        postService.loadPosts(posts);
        bookingService.loadBookings(bookings);
        cout << "[FileManager] Da nap " << users.size() << " users va "
             << posts.size() << " bai dang tu thu muc data/!\n";
    }

    // 2. Lấy PORT từ biến môi trường (Render tự cấp biến PORT, mặc định 10000 hoặc 5000)
    int port = 5000;
    const char* envPort = getenv("PORT");
    if (envPort != nullptr) {
        try {
            port = stoi(envPort);
        } catch (...) {
            port = 5000;
        }
    }

    cout << "[Server] Khoi dong server tai port " << port << "...\n";
    HttpServer server(port, authService, tutorService, postService, bookingService, fileManager);
    server.start();

    return 0;
}
