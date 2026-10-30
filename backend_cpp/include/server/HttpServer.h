#ifndef HTTP_SERVER_H
#define HTTP_SERVER_H

#include <string>
#include <unordered_map>
#include <functional>
#include "../services/AuthService.h"
#include "../services/TutorService.h"
#include "../services/PostService.h"
#include "../services/BookingService.h"
#include "../storage/FileManager.h"

struct HttpRequest {
    std::string method;
    std::string path;
    std::unordered_map<std::string, std::string> queryParams;
    std::unordered_map<std::string, std::string> headers;
    std::string body;
};

struct HttpResponse {
    int statusCode;
    std::string contentType;
    std::string body;
    std::string setCookie;

    HttpResponse(int code = 200, const std::string& type = "application/json", const std::string& b = "", const std::string& cookie = "")
        : statusCode(code), contentType(type), body(b), setCookie(cookie) {}
};

class HttpServer {
private:
    int port;
    int serverFd;
    bool isRunning;

    AuthService& authService;
    TutorService& tutorService;
    PostService& postService;
    BookingService& bookingService;
    FileManager& fileManager;

    HttpRequest parseRequest(const std::string& rawRequest);
    std::string buildResponse(const HttpResponse& response, const std::string& origin = "");
    HttpResponse routeRequest(const HttpRequest& request);

    std::string extractJsonValue(const std::string& json, const std::string& key);

public:
    HttpServer(int port, AuthService& auth, TutorService& tutor, 
               PostService& post, BookingService& booking, FileManager& fm);
    ~HttpServer();

    void start();
    void stop();
};

#endif
