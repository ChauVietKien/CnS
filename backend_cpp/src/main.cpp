#include <iostream>
#include <cstdlib>
#include "../include/services/AuthService.h"
#include "../include/services/TutorService.h"
#include "../include/services/PostService.h"
#include "../include/services/ApplicationService.h"
#include "../include/storage/FileManager.h"
#include "../include/server/HttpServer.h"

using namespace std;

int main() {
    AuthService authService;
    TutorService tutorService;
    PostService postService;
    ApplicationService applicationService;
    FileManager fileManager("data");

    // 1. Nạp dữ liệu từ thư mục data/
    auto users = fileManager.loadUsers();
    auto profiles = fileManager.loadTutorProfiles();
    auto posts = fileManager.loadTutorPosts();
    auto applications = fileManager.loadApplications();
    auto reviews = fileManager.loadReviews();

    if (!users.empty() || !posts.empty() || !reviews.empty()) {
        authService.loadUsers(users);
        tutorService.loadProfiles(profiles);
        tutorService.loadReviews(reviews);
        for (const auto& u : users) {
            postService.setTutorName(u.getId(), u.getFullName());
            postService.updateTutorRating(u.getId(), tutorService.getAverageRating(u.getId()));
        }
        postService.loadPosts(posts);
        applicationService.loadApplications(applications);
    }

    // 2. Lấy PORT từ biến môi trường (Render tự cấp biến PORT, mặc định 5000)
    int port = 5000;
    const char* envPort = getenv("PORT");
    if (envPort != nullptr) {
        try {
            port = stoi(envPort);
        } catch (...) {
            port = 5000;
        }
    }

    cout << "[Server] Khoi dong C++ REST API tai port " << port << "...\n";
    HttpServer server(port, authService, tutorService, postService, applicationService, fileManager);
    server.start();

    return 0;
}
