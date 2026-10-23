#include "../../include/server/HttpServer.h"
#include <iostream>
#include <sstream>
#include <cstring>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>

using namespace std;

HttpServer::HttpServer(int port, AuthService& auth, TutorService& tutor, 
                       PostService& post, BookingService& booking, FileManager& fm)
    : port(port), serverFd(-1), isRunning(false), authService(auth), 
      tutorService(tutor), postService(post), bookingService(booking), fileManager(fm) {}

HttpServer::~HttpServer() {
    stop();
}

string HttpServer::extractJsonValue(const string& json, const string& key) {
    string target = "\"" + key + "\"";
    size_t pos = json.find(target);
    if (pos == string::npos) return "";

    pos = json.find(':', pos);
    if (pos == string::npos) return "";

    pos = json.find_first_not_of(" \t\r\n", pos + 1);
    if (pos == string::npos) return "";

    if (json[pos] == '\"') {
        size_t endPos = json.find('\"', pos + 1);
        if (endPos == string::npos) return "";
        return json.substr(pos + 1, endPos - pos - 1);
    } else {
        size_t endPos = json.find_first_of(",}\r\n", pos);
        if (endPos == string::npos) endPos = json.length();
        string val = json.substr(pos, endPos - pos);
        size_t last = val.find_last_not_of(" \t\r\n");
        if (last != string::npos) return val.substr(0, last + 1);
        return val;
    }
}

HttpRequest HttpServer::parseRequest(const string& rawRequest) {
    HttpRequest req;
    stringstream ss(rawRequest);
    string line;

    if (getline(ss, line)) {
        stringstream lineStream(line);
        lineStream >> req.method;
        string fullPath;
        lineStream >> fullPath;

        size_t qPos = fullPath.find('?');
        if (qPos != string::npos) {
            req.path = fullPath.substr(0, qPos);
            string query = fullPath.substr(qPos + 1);
            stringstream qStream(query);
            string param;
            while (getline(qStream, param, '&')) {
                size_t eqPos = param.find('=');
                if (eqPos != string::npos) {
                    req.queryParams[param.substr(0, eqPos)] = param.substr(eqPos + 1);
                }
            }
        } else {
            req.path = fullPath;
        }
    }

    while (getline(ss, line) && line != "\r" && !line.empty()) {
        size_t colon = line.find(':');
        if (colon != string::npos) {
            string headerName = line.substr(0, colon);
            string headerVal = line.substr(colon + 1);
            req.headers[headerName] = headerVal;
        }
    }

    stringstream bodyStream;
    while (getline(ss, line)) {
        bodyStream << line << "\n";
    }
    req.body = bodyStream.str();

    return req;
}

string HttpServer::buildResponse(const HttpResponse& res) {
    stringstream ss;
    ss << "HTTP/1.1 " << res.statusCode << " ";
    if (res.statusCode == 200) ss << "OK\r\n";
    else if (res.statusCode == 201) ss << "Created\r\n";
    else if (res.statusCode == 400) ss << "Bad Request\r\n";
    else if (res.statusCode == 401) ss << "Unauthorized\r\n";
    else if (res.statusCode == 404) ss << "Not Found\r\n";
    else ss << "Internal Server Error\r\n";

    ss << "Content-Type: " << res.contentType << "; charset=utf-8\r\n";
    ss << "Content-Length: " << res.body.length() << "\r\n";
    ss << "Access-Control-Allow-Origin: *\r\n";
    ss << "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n";
    ss << "Access-Control-Allow-Headers: Content-Type, Authorization\r\n";
    ss << "Connection: close\r\n";
    ss << "\r\n";
    ss << res.body;

    return ss.str();
}

HttpResponse HttpServer::routeRequest(const HttpRequest& req) {
    if (req.method == "OPTIONS") {
        return HttpResponse(200, "text/plain", "");
    }

    if (req.method == "GET" && req.path == "/api/health") {
        return HttpResponse(200, "application/json", "{\"status\":\"ok\",\"service\":\"cns-backend-cpp\"}");
    }

    if (req.method == "GET" && req.path == "/api/tutors/suggest") {
        string q = req.queryParams.count("q") ? req.queryParams.at("q") : "";
        vector<string> suggestions = postService.suggestSubjects(q);
        stringstream ss;
        ss << "[";
        for (size_t i = 0; i < suggestions.size(); ++i) {
            ss << "\"" << suggestions[i] << "\"";
            if (i + 1 < suggestions.size()) ss << ",";
        }
        ss << "]";
        return HttpResponse(200, "application/json", ss.str());
    }

    if (req.method == "GET" && req.path == "/api/tutors/filter") {
        long long minP = req.queryParams.count("min") ? stoll(req.queryParams.at("min")) : 0;
        long long maxP = req.queryParams.count("max") ? stoll(req.queryParams.at("max")) : 10000000;
        vector<TutorPost> filtered = postService.filterByTuition(minP, maxP);

        stringstream ss;
        ss << "[";
        for (size_t i = 0; i < filtered.size(); ++i) {
            const auto& p = filtered[i];
            ss << "{\"id\":" << p.getId() << ",\"title\":\"" << p.getTitle() << "\",\"subject\":\"" 
               << p.getSubjectName() << "\",\"grade\":" << p.getGrade() << ",\"tuition\":" 
               << p.getTuitionPerHour() << "}";
            if (i + 1 < filtered.size()) ss << ",";
        }
        ss << "]";
        return HttpResponse(200, "application/json", ss.str());
    }

    if (req.method == "GET" && req.path == "/api/tutors/top") {
        vector<TutorPost> top = postService.getTopRecommended(5);
        stringstream ss;
        ss << "[";
        for (size_t i = 0; i < top.size(); ++i) {
            const auto& p = top[i];
            ss << "{\"id\":" << p.getId() << ",\"title\":\"" << p.getTitle() << "\",\"subject\":\"" 
               << p.getSubjectName() << "\",\"grade\":" << p.getGrade() << ",\"tuition\":" 
               << p.getTuitionPerHour() << "}";
            if (i + 1 < top.size()) ss << ",";
        }
        ss << "]";
        return HttpResponse(200, "application/json", ss.str());
    }

    if (req.method == "POST" && req.path == "/api/auth/register") {
        string username = extractJsonValue(req.body, "username");
        string password = extractJsonValue(req.body, "password");
        string fullName = extractJsonValue(req.body, "fullName");
        string phone = extractJsonValue(req.body, "phone");
        string email = extractJsonValue(req.body, "email");
        string roleStr = extractJsonValue(req.body, "role");

        Role role = Role::STUDENT;
        if (roleStr == "tutor") role = Role::TUTOR;
        else if (roleStr == "admin") role = Role::ADMIN;

        string err;
        if (authService.registerUser(username, password, fullName, phone, email, role, err)) {
            fileManager.saveUsers(authService.getAllUsers());
            return HttpResponse(201, "application/json", "{\"message\":\"User registered successfully\"}");
        } else {
            return HttpResponse(400, "application/json", "{\"error\":\"" + err + "\"}");
        }
    }

    if (req.method == "POST" && req.path == "/api/auth/login") {
        string username = extractJsonValue(req.body, "username");
        string password = extractJsonValue(req.body, "password");

        string err;
        auto user = authService.login(username, password, err);
        if (user.has_value()) {
            stringstream ss;
            ss << "{\"id\":" << user->getId() << ",\"username\":\"" << user->getUsername() 
               << "\",\"fullName\":\"" << user->getFullName() << "\",\"role\":" 
               << static_cast<int>(user->getRole()) << "}";
            return HttpResponse(200, "application/json", ss.str());
        } else {
            return HttpResponse(401, "application/json", "{\"error\":\"" + err + "\"}");
        }
    }

    if (req.method == "POST" && req.path == "/api/bookings") {
        string studentIdStr = extractJsonValue(req.body, "studentId");
        string tutorIdStr = extractJsonValue(req.body, "tutorId");
        string postIdStr = extractJsonValue(req.body, "postId");
        string time = extractJsonValue(req.body, "scheduledTime");
        string notes = extractJsonValue(req.body, "notes");

        int sId = studentIdStr.empty() ? 0 : stoi(studentIdStr);
        int tId = tutorIdStr.empty() ? 0 : stoi(tutorIdStr);
        int pId = postIdStr.empty() ? 0 : stoi(postIdStr);

        int bId = bookingService.createBooking(sId, tId, pId, time, notes);
        return HttpResponse(201, "application/json", "{\"bookingId\":" + to_string(bId) + "}");
    }

    if (req.method == "GET" && req.path == "/api/bookings/nearest") {
        auto nearest = bookingService.getNearestUpcomingEvent();
        if (nearest.has_value()) {
            return HttpResponse(200, "application/json", 
                "{\"bookingId\":" + to_string(nearest->bookingId) + ",\"time\":\"" + nearest->timestamp + "\"}");
        }
        return HttpResponse(404, "application/json", "{\"message\":\"No upcoming events\"}");
    }

    return HttpResponse(404, "application/json", "{\"error\":\"Not Found\"}");
}

void HttpServer::start() {
    serverFd = socket(AF_INET, SOCK_STREAM, 0);
    if (serverFd < 0) return;

    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    sockaddr_in address;
    memset(&address, 0, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(serverFd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        close(serverFd);
        serverFd = -1;
        return;
    }

    if (listen(serverFd, 10) < 0) {
        close(serverFd);
        serverFd = -1;
        return;
    }

    isRunning = true;
    cout << "C++ REST API Server chay tai port " << port << "..." << endl;

    while (isRunning) {
        int clientFd = accept(serverFd, nullptr, nullptr);
        if (clientFd < 0) {
            if (!isRunning) break;
            continue;
        }

        char buffer[4096];
        memset(buffer, 0, sizeof(buffer));
        ssize_t bytesRead = read(clientFd, buffer, sizeof(buffer) - 1);

        if (bytesRead > 0) {
            string raw(buffer, bytesRead);
            HttpRequest req = parseRequest(raw);
            HttpResponse res = routeRequest(req);
            string rawRes = buildResponse(res);
            write(clientFd, rawRes.c_str(), rawRes.length());
        }

        close(clientFd);
    }
}

void HttpServer::stop() {
    isRunning = false;
    if (serverFd >= 0) {
        close(serverFd);
        serverFd = -1;
    }
}
