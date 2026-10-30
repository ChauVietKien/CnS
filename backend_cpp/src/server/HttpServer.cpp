#include "../../include/server/HttpServer.h"
#include <iostream>
#include <sstream>
#include <cstring>
#include <vector>
#include <algorithm>

#ifdef _WIN32
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")
typedef int socklen_t;
#else
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#define closesocket close
#endif

using namespace std;

// --- Helper URL Decode ---
static string urlDecode(const string& str) {
    string res;
    for (size_t i = 0; i < str.length(); ++i) {
        if (str[i] == '%' && i + 2 < str.length()) {
            try {
                int val = stoi(str.substr(i + 1, 2), nullptr, 16);
                res += static_cast<char>(val);
                i += 2;
            } catch (...) {
                res += str[i];
            }
        } else if (str[i] == '+') {
            res += ' ';
        } else {
            res += str[i];
        }
    }
    return res;
}

// --- Base64 & Mock JWT ---
static string toSimpleAscii(const string& str) {
    string res;
    for (size_t i = 0; i < str.size();) {
        unsigned char c = (unsigned char)str[i];
        if (c < 128) {
            res += tolower(c);
            i++;
        } else if (i + 1 < str.size()) {
            string two = str.substr(i, 2);
            if (two == "à" || two == "á" || two == "ả" || two == "ã" || two == "ạ" ||
                two == "â" || two == "ầ" || two == "ấ" || two == "ẩ" || two == "ẫ" || two == "ậ" ||
                two == "ă" || two == "ằ" || two == "ắ" || two == "ẳ" || two == "ẵ" || two == "ặ" ||
                two == "À" || two == "Á" || two == "Ả" || two == "Ã" || two == "Ạ") {
                res += 'a'; i += 2; continue;
            }
            if (two == "è" || two == "é" || two == "ẻ" || two == "ẽ" || two == "ẹ" ||
                two == "ê" || two == "ề" || two == "ế" || two == "ể" || two == "ễ" || two == "ệ" ||
                two == "È" || two == "É" || two == "Ẻ" || two == "Ẽ" || two == "Ẹ") {
                res += 'e'; i += 2; continue;
            }
            if (two == "ì" || two == "í" || two == "ỉ" || two == "ĩ" || two == "ị" ||
                two == "Ì" || two == "Í" || two == "Ỉ" || two == "Ĩ" || two == "Ị") {
                res += 'i'; i += 2; continue;
            }
            if (two == "ò" || two == "ó" || two == "ỏ" || two == "õ" || two == "ọ" ||
                two == "ô" || two == "ồ" || two == "ố" || two == "ổ" || two == "ỗ" || two == "ộ" ||
                two == "ơ" || two == "ờ" || two == "ớ" || two == "ở" || two == "ỡ" || two == "ợ" ||
                two == "Ò" || two == "Ó" || two == "Ỏ" || two == "Õ" || two == "Ọ") {
                res += 'o'; i += 2; continue;
            }
            if (two == "ù" || two == "ú" || two == "ủ" || two == "ũ" || two == "ụ" ||
                two == "ư" || two == "ừ" || two == "ứ" || two == "ử" || two == "ữ" || two == "ự" ||
                two == "Ù" || two == "Ú" || two == "Ủ" || two == "Ũ" || two == "Ụ") {
                res += 'u'; i += 2; continue;
            }
            if (two == "ỳ" || two == "ý" || two == "ỷ" || two == "ỹ" || two == "ỵ" ||
                two == "Ỳ" || two == "Ý" || two == "Ỷ" || two == "Ỹ" || two == "Ỵ") {
                res += 'y'; i += 2; continue;
            }
            if (two == "đ" || two == "Đ") {
                res += 'd'; i += 2; continue;
            }
            if (i + 2 < str.size()) {
                i += 3;
            } else {
                i += 2;
            }
        } else {
            i++;
        }
    }
    return res;
}

static const string base64_chars = 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789+/";

static string base64_encode(const string& in) {
    string out;
    int val = 0, valb = -6;
    for (unsigned char c : in) {
        val = (val << 8) + c;
        valb += 8;
        while (valb >= 0) {
            out.push_back(base64_chars[(val >> valb) & 0x3F]);
            valb -= 6;
        }
    }
    if (valb > -6) out.push_back(base64_chars[((val << 8) >> (valb + 8)) & 0x3F]);
    while (out.size() % 4) out.push_back('=');
    return out;
}

static string base64url_encode(const string& in) {
    string b64 = base64_encode(in);
    string res;
    for (char c : b64) {
        if (c == '+') res += '-';
        else if (c == '/') res += '_';
        else if (c != '=') res += c;
    }
    return res;
}

static string generateMockJwt(int userId, const string& email, const string& roleStr) {
    string header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    string payload = "{\"id\":\"" + to_string(userId) + "\",\"email\":\"" + email + 
                     "\",\"role\":\"" + roleStr + "\",\"exp\":2147483647}";
    return base64url_encode(header) + "." + base64url_encode(payload) + ".mock_token_sig";
}

// --- JSON Formatting for TutorPost ---
static string escapeJsonString(const string& s) {
    string res;
    for (char c : s) {
        if (c == '"') res += "\\\"";
        else if (c == '\\') res += "\\\\";
        else if (c == '\n') res += "\\n";
        else if (c == '\r') res += "\\r";
        else if (c == '\t') res += "\\t";
        else res += c;
    }
    return res;
}

static string formatSinglePostJson(const TutorPost& post, const AuthService& authService, const TutorService& tutorService) {
    int tId = post.getTutorId();
    vector<User> allUsers = authService.getAllUsers();
    string name = "Gia sư", phone = "0901234567", email = "tutor@gmail.com";
    for (const auto& u : allUsers) {
        if (u.getId() == tId) {
            name = u.getFullName();
            phone = u.getPhone();
            email = u.getEmail();
            break;
        }
    }

    string desc = "Giảng viên giàu kinh nghiệm";
    auto profOpt = tutorService.getProfile(tId);
    if (profOpt.has_value() && !profOpt->getBio().empty()) {
        desc = profOpt->getBio();
    }

    string proofImg = post.getProof().empty() 
        ? "https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736" 
        : post.getProof();

    string modeStr = (post.getMode() == TeachingMode::ONLINE) ? "Online" : "Offline";
    string classStr = post.getClassGrade().empty() ? ("Lớp " + to_string(post.getGrade())) : post.getClassGrade();
    string addrStr = post.getAddress().empty() ? "Đà Nẵng" : post.getAddress();

    ostringstream json;
    json << "{"
         << "\"id\":\"" << post.getId() << "\","
         << "\"subject\":\"" << escapeJsonString(post.getSubjectName()) << "\","
         << "\"postname\":\"" << escapeJsonString(post.getTitle()) << "\","
         << "\"title\":\"" << escapeJsonString(post.getTitle()) << "\","
         << "\"Class\":\"" << escapeJsonString(classStr) << "\","
         << "\"class\":\"" << escapeJsonString(classStr) << "\","
         << "\"description\":\"" << escapeJsonString(post.getDescription()) << "\","
         << "\"method\":\"" << modeStr << "\","
         << "\"mode\":\"" << modeStr << "\","
         << "\"price\":" << post.getTuitionPerHour() << ","
         << "\"address\":\"" << escapeJsonString(addrStr) << "\","
         << "\"proof\":\"" << escapeJsonString(proofImg) << "\","
         << "\"field\":\"Giáo dục\","
         << "\"tutorId\":\"" << tId << "\","
         << "\"tutor\":{"
             << "\"id\":\"" << tId << "\","
             << "\"name\":\"" << escapeJsonString(name) << "\","
             << "\"phone\":\"" << escapeJsonString(phone) << "\","
             << "\"avatar\":\"" << escapeJsonString(proofImg) << "\","
             << "\"description\":\"" << escapeJsonString(desc) << "\","
             << "\"user\":{"
                 << "\"id\":\"" << tId << "\","
                 << "\"email\":\"" << escapeJsonString(email) << "\""
             << "}"
         << "},"
         << "\"schedules\":["
             << "{\"day\":\"Thứ 2\",\"startTime\":\"18:00\",\"endTime\":\"20:00\"},"
             << "{\"day\":\"Thứ 4\",\"startTime\":\"18:00\",\"endTime\":\"20:00\"}"
         << "]"
         << "}";
    return json.str();
}

static string buildPostsJson(const vector<TutorPost>& posts, const AuthService& authService, const TutorService& tutorService) {
    ostringstream json;
    json << "{\"status\":\"OK\",\"success\":true,\"data\":[";
    for (size_t i = 0; i < posts.size(); ++i) {
        if (i > 0) json << ",";
        json << formatSinglePostJson(posts[i], authService, tutorService);
    }
    json << "]}";
    return json.str();
}

HttpServer::HttpServer(int port, AuthService& auth, TutorService& tutor,
                       PostService& post, BookingService& booking, FileManager& fm)
    : port(port), serverFd(-1), isRunning(false),
      authService(auth), tutorService(tutor),
      postService(post), bookingService(booking), fileManager(fm) {}

HttpServer::~HttpServer() {
    stop();
}

void HttpServer::start() {
#ifdef _WIN32
    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);
#endif

    serverFd = socket(AF_INET, SOCK_STREAM, 0);
    if (serverFd < 0) {
        cerr << "[HttpServer] Loi tao socket!\n";
        return;
    }

    int opt = 1;
    setsockopt(serverFd, SOL_SOCKET, SO_REUSEADDR, (const char*)&opt, sizeof(opt));

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    if (bind(serverFd, (struct sockaddr*)&addr, sizeof(addr)) < 0 || listen(serverFd, 10) < 0) {
        cerr << "[HttpServer] Khong the mo cong " << port << "\n";
        closesocket(serverFd);
        return;
    }

    isRunning = true;
    cout << "[HttpServer] Backend C++ REST API dang chay tai http://localhost:" << port << endl;

    while (isRunning) {
        sockaddr_in clientAddr{};
        socklen_t clientLen = sizeof(clientAddr);
        int clientFd = accept(serverFd, (struct sockaddr*)&clientAddr, &clientLen);
        if (clientFd < 0) continue;

        string rawRequest;
        char buffer[4096];
        int bytesRead = recv(clientFd, buffer, sizeof(buffer), 0);
        if (bytesRead > 0) {
            rawRequest.append(buffer, bytesRead);

            // Doc toan bo Body dua theo Content-Length
            size_t clPos = rawRequest.find("Content-Length:");
            if (clPos == string::npos) clPos = rawRequest.find("content-length:");
            if (clPos != string::npos) {
                size_t clEnd = rawRequest.find("\r\n", clPos);
                if (clEnd != string::npos) {
                    try {
                        int contentLength = stoi(rawRequest.substr(clPos + 15, clEnd - clPos - 15));
                        size_t bodyPos = rawRequest.find("\r\n\r\n");
                        if (bodyPos != string::npos) {
                            int bodySoFar = rawRequest.size() - (bodyPos + 4);
                            while (bodySoFar < contentLength) {
                                int more = recv(clientFd, buffer, sizeof(buffer), 0);
                                if (more <= 0) break;
                                rawRequest.append(buffer, more);
                                bodySoFar += more;
                            }
                        }
                    } catch (...) {}
                }
            }

            HttpRequest req = parseRequest(rawRequest);
            HttpResponse res = routeRequest(req);

            string clientOrigin = "";
            if (req.headers.count("origin")) clientOrigin = req.headers["origin"];
            else if (req.headers.count("Origin")) clientOrigin = req.headers["Origin"];

            string rawRes = buildResponse(res, clientOrigin);
            send(clientFd, rawRes.c_str(), (int)rawRes.size(), 0);
        }
        closesocket(clientFd);
    }
}

void HttpServer::stop() {
    if (isRunning) {
        isRunning = false;
        if (serverFd >= 0) closesocket(serverFd);
#ifdef _WIN32
        WSACleanup();
#endif
    }
}

HttpRequest HttpServer::parseRequest(const string& rawRequest) {
    HttpRequest req;
    istringstream iss(rawRequest);
    string line;

    // 1. First line: METHOD PATH HTTP/1.1
    if (getline(iss, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();
        istringstream lineStream(line);
        string fullPath;
        lineStream >> req.method >> fullPath;

        size_t qPos = fullPath.find('?');
        if (qPos != string::npos) {
            req.path = fullPath.substr(0, qPos);
            string queryStr = fullPath.substr(qPos + 1);
            istringstream qStream(queryStr);
            string pair;
            while (getline(qStream, pair, '&')) {
                size_t eqPos = pair.find('=');
                if (eqPos != string::npos) {
                    req.queryParams[urlDecode(pair.substr(0, eqPos))] = urlDecode(pair.substr(eqPos + 1));
                }
            }
        } else {
            req.path = fullPath;
        }
    }

    // 2. Headers
    while (getline(iss, line) && line != "\r" && !line.empty()) {
        if (line.back() == '\r') line.pop_back();
        size_t colon = line.find(':');
        if (colon != string::npos) {
            string key = line.substr(0, colon);
            string val = line.substr(colon + 1);
            if (!val.empty() && val[0] == ' ') val.erase(0, 1);
            req.headers[key] = val;
        }
    }

    // 3. Body
    size_t bodyPos = rawRequest.find("\r\n\r\n");
    if (bodyPos != string::npos) {
        req.body = rawRequest.substr(bodyPos + 4);
    }
    return req;
}

string HttpServer::buildResponse(const HttpResponse& response, const string& origin) {
    string statusText = (response.statusCode == 200) ? "OK" :
                        (response.statusCode == 201) ? "Created" :
                        (response.statusCode == 204) ? "No Content" :
                        (response.statusCode == 400) ? "Bad Request" :
                        (response.statusCode == 401) ? "Unauthorized" :
                        (response.statusCode == 404) ? "Not Found" : "Internal Server Error";

    string allowOrigin = origin.empty() ? "http://localhost:3000" : origin;

    ostringstream oss;
    oss << "HTTP/1.1 " << response.statusCode << " " << statusText << "\r\n"
        << "Content-Type: " << response.contentType << "; charset=utf-8\r\n"
        << "Access-Control-Allow-Origin: " << allowOrigin << "\r\n"
        << "Access-Control-Allow-Credentials: true\r\n"
        << "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\r\n"
        << "Access-Control-Allow-Headers: Content-Type, Authorization, Cookie, X-Requested-With, Accept\r\n";

    if (!response.setCookie.empty()) {
        oss << "Set-Cookie: " << response.setCookie << "\r\n";
    }

    oss << "Content-Length: " << response.body.size() << "\r\n"
        << "Connection: close\r\n\r\n"
        << response.body;
    return oss.str();
}

string HttpServer::extractJsonValue(const string& json, const string& key) {
    string searchKey = "\"" + key + "\"";
    size_t pos = json.find(searchKey);
    if (pos == string::npos) return "";
    pos = json.find(':', pos);
    if (pos == string::npos) return "";
    pos++;
    while (pos < json.size() && (json[pos] == ' ' || json[pos] == '\t' || json[pos] == '\n' || json[pos] == '\r')) pos++;
    if (pos >= json.size()) return "";

    if (json[pos] == '"') {
        size_t endPos = json.find('"', pos + 1);
        return (endPos != string::npos) ? json.substr(pos + 1, endPos - pos - 1) : "";
    } else {
        size_t endPos = json.find_first_of(",}\r\n", pos);
        string val = (endPos != string::npos) ? json.substr(pos, endPos - pos) : json.substr(pos);
        while (!val.empty() && (val.back() == ' ' || val.back() == '\r' || val.back() == '\n')) val.pop_back();
        return val;
    }
}

HttpResponse HttpServer::routeRequest(const HttpRequest& req) {
    // 0. CORS Preflight
    if (req.method == "OPTIONS") {
        return HttpResponse(200, "text/plain", "");
    }

    // ==========================================
    // 1. TUTOR POST APIS
    // ==========================================

    // GET all posts
    if (req.method == "GET" && (req.path == "/api/tutor-post/get-all-posts" || req.path == "/api/tutor-post")) {
        vector<TutorPost> posts = postService.getAllActivePosts();
        return HttpResponse(200, "application/json", buildPostsJson(posts, authService, tutorService));
    }

    // GET post detail
    if (req.method == "GET" && req.path.rfind("/api/tutor-post/get-post/", 0) == 0) {
        string idStr = req.path.substr(string("/api/tutor-post/get-post/").length());
        try {
            int pId = stoi(idStr);
            auto opt = postService.getPostById(pId);
            if (opt.has_value()) {
                string postJson = formatSinglePostJson(*opt, authService, tutorService);
                return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"success\":true,\"data\":" + postJson + "}");
            }
        } catch (...) {}
        return HttpResponse(404, "application/json", "{\"status\":\"ERR\",\"message\":\"Post not found\"}");
    }

    // GET posts by tutor userId
    if (req.method == "GET" && req.path.rfind("/api/tutor-post/get-posts-by-user/", 0) == 0) {
        string uStr = req.path.substr(string("/api/tutor-post/get-posts-by-user/").length());
        int uId = 1;
        try { uId = stoi(uStr); } catch (...) {}
        vector<TutorPost> posts = postService.getPostsByTutor(uId);
        return HttpResponse(200, "application/json", buildPostsJson(posts, authService, tutorService));
    }

    // POST create post
    if (req.method == "POST" && req.path == "/api/tutor-post/create") {
        string subject = extractJsonValue(req.body, "subject");
        if (subject.empty()) subject = "Môn học mới";
        string classGrade = extractJsonValue(req.body, "Class");
        string methodStr = extractJsonValue(req.body, "method");
        string priceStr = extractJsonValue(req.body, "price");
        long long price = priceStr.empty() ? 200000 : stoll(priceStr);
        string desc = extractJsonValue(req.body, "description");
        string address = extractJsonValue(req.body, "address");
        string errMsg;

        TeachingMode mode = (methodStr == "Online" || methodStr == "ONLINE") ? TeachingMode::ONLINE : TeachingMode::OFFLINE;
        postService.createPost(1, subject, desc, subject, 12, price, mode, {address}, "Thứ 2 & Thứ 4", errMsg);

        fileManager.saveTutorPosts(postService.getAllActivePosts());
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Create post success!\",\"data\":{\"id\":\"99\"}}");
    }

    // PUT update post
    if (req.method == "PUT" && req.path.rfind("/api/tutor-post/update-post/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Update post success\"}");
    }

    // PUT update status
    if (req.method == "PUT" && req.path.rfind("/api/tutor-post/update-status/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Status updated\"}");
    }

    // DELETE post
    if (req.method == "DELETE" && req.path.rfind("/api/tutor-post/delete-post/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Delete post success\"}");
    }

    // ==========================================
    // 2. SEARCH & FILTER APIS (TRIE & BST)
    // ==========================================

    // Autocomplete (Trie)
    if (req.method == "GET" && req.path == "/api/autocomplete") {
        string q = req.queryParams.count("q") ? req.queryParams.at("q") : "";
        vector<string> suggestions = postService.suggestSubjects(q);
        ostringstream oss;
        oss << "{\"status\":\"OK\",\"success\":true,\"data\":[";
        for (size_t i = 0; i < suggestions.size(); ++i) {
            if (i > 0) oss << ",";
            oss << "\"" << escapeJsonString(suggestions[i]) << "\"";
        }
        oss << "]}";
        return HttpResponse(200, "application/json", oss.str());
    }

    // Search by subject name (Trie + Fallback Accent Normalization)
    if (req.method == "GET" && req.path == "/api/search") {
        string q = req.queryParams.count("q") ? req.queryParams.at("q") : "";
        vector<TutorPost> posts;
        if (q.empty()) {
            posts = postService.getAllActivePosts();
        } else {
            posts = postService.searchBySubject(q);
            if (posts.empty()) {
                vector<TutorPost> all = postService.getAllActivePosts();
                string qAscii = toSimpleAscii(q);
                string qLower = q;
                transform(qLower.begin(), qLower.end(), qLower.begin(), ::tolower);

                for (const auto& p : all) {
                    string sAscii = toSimpleAscii(p.getSubjectName());
                    string sLower = p.getSubjectName();
                    transform(sLower.begin(), sLower.end(), sLower.begin(), ::tolower);

                    if (sLower.find(qLower) != string::npos ||
                        (!qAscii.empty() && sAscii.find(qAscii) != string::npos)) {
                        posts.push_back(p);
                    }
                }
            }
        }
        return HttpResponse(200, "application/json", buildPostsJson(posts, authService, tutorService));
    }

    // Filter by tuition, grade, mode, province (BST)
    if (req.method == "GET" && (req.path == "/api/filter-post" || req.path == "/api/tutor-post/filter-post")) {
        long long minP = 0, maxP = 999999999;
        if (req.queryParams.count("minPrice") && !req.queryParams.at("minPrice").empty()) {
            try { minP = stoll(req.queryParams.at("minPrice")); } catch (...) {}
        }
        if (req.queryParams.count("maxPrice") && !req.queryParams.at("maxPrice").empty()) {
            try { maxP = stoll(req.queryParams.at("maxPrice")); } catch (...) {}
        }

        string classId = req.queryParams.count("classId") ? req.queryParams.at("classId") : "";
        string mode = req.queryParams.count("mode") ? req.queryParams.at("mode") : "";
        string prov = req.queryParams.count("province") ? req.queryParams.at("province") : "";

        // Dung cay BST lay cac bai dang theo khoang gia
        vector<TutorPost> candidates = postService.filterByTuition(minP, maxP);
        vector<TutorPost> filtered;

        for (const auto& p : candidates) {
            // Kiem tra classId (lop hoc)
            if (!classId.empty()) {
                string gStr = to_string(p.getGrade());
                if (gStr != classId && p.getClassGrade().find(classId) == string::npos) {
                    continue;
                }
            }
            // Kiem tra hinh thuc hoc (ONLINE / OFFLINE)
            if (!mode.empty()) {
                string pMode = (p.getMode() == TeachingMode::ONLINE) ? "ONLINE" : "OFFLINE";
                string mUpper = mode;
                transform(mUpper.begin(), mUpper.end(), mUpper.begin(), ::toupper);
                if (pMode != mUpper) continue;
            }
            // Kiem tra khu vuc / tinh thanh
            if (!prov.empty()) {
                if (p.getAddress().find(prov) == string::npos) {
                    continue;
                }
            }
            filtered.push_back(p);
        }

        return HttpResponse(200, "application/json", buildPostsJson(filtered, authService, tutorService));
    }

    // ==========================================
    // 3. AUTH & USER APIS
    // ==========================================

    // Sign in (Frontend & API)
    if (req.method == "POST" && (req.path == "/api/user/sign-in" || req.path == "/api/auth/login")) {
        string email = extractJsonValue(req.body, "email");
        if (email.empty()) email = extractJsonValue(req.body, "username");
        string pass = extractJsonValue(req.body, "password");

        string err;
        auto userOpt = authService.login(email, pass, err);
        if (userOpt.has_value()) {
            User u = *userOpt;
            string roleStr = (u.getRole() == Role::TUTOR) ? "tutor" : 
                             (u.getRole() == Role::ADMIN ? "admin" : "student");
            string token = generateMockJwt(u.getId(), u.getEmail(), roleStr);

            ostringstream oss;
            oss << "{"
                << "\"status\":\"OK\","
                << "\"message\":\"Login success\","
                << "\"access_token\":\"" << token << "\","
                << "\"data\":{"
                    << "\"id\":\"" << u.getId() << "\","
                    << "\"name\":\"" << escapeJsonString(u.getFullName()) << "\","
                    << "\"email\":\"" << escapeJsonString(u.getEmail()) << "\","
                    << "\"role\":\"" << roleStr << "\","
                    << "\"phone\":\"" << escapeJsonString(u.getPhone()) << "\""
                << "}"
                << "}";
            string cookie = "refresh_token=" + token + "; Path=/; HttpOnly; SameSite=Lax";
            return HttpResponse(200, "application/json", oss.str(), cookie);
        }
        return HttpResponse(400, "application/json", "{\"status\":\"ERR\",\"message\":\"" + err + "\"}");
    }

    // Sign up
    if (req.method == "POST" && req.path == "/api/user/sign-up") {
        string email = extractJsonValue(req.body, "email");
        string pass = extractJsonValue(req.body, "password");
        if (email.empty() || pass.empty()) {
            return HttpResponse(400, "application/json", "{\"status\":\"ERR\",\"message\":\"Email and password are required\"}");
        }

        string uname = email;
        size_t atPos = email.find('@');
        if (atPos != string::npos) uname = email.substr(0, atPos);

        string err;
        bool ok = authService.registerUser(uname, pass, uname, "", email, Role::STUDENT, err);
        if (ok) {
            fileManager.saveUsers(authService.getAllUsers());
            return HttpResponse(201, "application/json", "{\"status\":\"OK\",\"message\":\"Created User Sc!\",\"data\":{\"email\":\"" + email + "\",\"role\":\"student\"}}");
        }
        return HttpResponse(400, "application/json", "{\"status\":\"ERR\",\"message\":\"" + err + "\"}");
    }

    // Refresh token
    if (req.method == "POST" && req.path == "/api/user/refresh-token") {
        string token = generateMockJwt(1, "kien@gmail.com", "tutor");
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"access_token\":\"" + token + "\"}");
    }

    // Logout
    if (req.method == "POST" && req.path == "/api/user/log-out") {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Log out success\"}");
    }

    // Get detail user
    if (req.method == "GET" && req.path.rfind("/api/user/get-detail-user/", 0) == 0) {
        string idStr = req.path.substr(string("/api/user/get-detail-user/").length());
        int uId = 1;
        try { uId = stoi(idStr); } catch (...) {}
        auto uOpt = authService.getUserById(uId);
        if (uOpt.has_value()) {
            string roleStr = (uOpt->getRole() == Role::TUTOR) ? "Tutor" : 
                             (uOpt->getRole() == Role::ADMIN ? "Admin" : "Learner");
            ostringstream oss;
            oss << "{\"status\":\"OK\",\"data\":{"
                << "\"id\":\"" << uOpt->getId() << "\","
                << "\"name\":\"" << escapeJsonString(uOpt->getFullName()) << "\","
                << "\"email\":\"" << escapeJsonString(uOpt->getEmail()) << "\","
                << "\"age\":" << uOpt->getAge() << ","
                << "\"role\":\"" << roleStr << "\","
                << "\"phone\":\"" << escapeJsonString(uOpt->getPhone()) << "\","
                << "\"description\":\"Giảng viên giàu kinh nghiệm\""
                << "}}";
            return HttpResponse(200, "application/json", oss.str());
        }
        return HttpResponse(404, "application/json", "{\"status\":\"ERR\",\"message\":\"User not found\"}");
    }

    // Update user
    if (req.method == "PUT" && req.path.rfind("/api/user/update-user/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Update Success\",\"data\":{}}");
    }

    // Delete user
    if (req.method == "DELETE" && req.path.rfind("/api/user/delete-user/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Delete user success\"}");
    }

    // Get all users
    if (req.method == "GET" && req.path == "/api/user/get-all-users") {
        vector<User> all = authService.getAllUsers();
        ostringstream oss;
        oss << "{\"status\":\"OK\",\"data\":[";
        for (size_t i = 0; i < all.size(); ++i) {
            if (i > 0) oss << ",";
            string roleStr = (all[i].getRole() == Role::TUTOR) ? "tutor" : "student";
            oss << "{\"id\":\"" << all[i].getId() << "\",\"name\":\"" << escapeJsonString(all[i].getFullName())
                << "\",\"email\":\"" << escapeJsonString(all[i].getEmail()) << "\",\"role\":\"" << roleStr << "\"}";
        }
        oss << "]}";
        return HttpResponse(200, "application/json", oss.str());
    }

    // ==========================================
    // 4. STUDENT & TUTOR PROFILE APIS
    // ==========================================
    if (req.path.rfind("/api/student-profile/get-profile/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"data\":{\"name\":\"Đức Minh\",\"phone\":\"0907654321\"}}");
    }
    if (req.path == "/api/student-profile/create" || req.path.rfind("/api/student-profile/update-profile/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Success\",\"data\":{}}");
    }

    if (req.path.rfind("/api/tutor-profile/get-profile/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"data\":{\"name\":\"Châu Việt Kiên\",\"phone\":\"0901234567\",\"bio\":\"Giảng viên Bách Khoa\"}}");
    }
    if (req.path == "/api/tutor-profile/create" || req.path.rfind("/api/tutor-profile/update-profile/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Success\",\"data\":{}}");
    }

    // ==========================================
    // 5. APPLICATION (BOOKING) APIS
    // ==========================================
    if (req.method == "POST" && req.path == "/api/application/create") {
        string postId = extractJsonValue(req.body, "postId");
        string name = extractJsonValue(req.body, "name");
        string email = extractJsonValue(req.body, "email");
        string phone = extractJsonValue(req.body, "phone");
        string note = extractJsonValue(req.body, "note");
        int pId = postId.empty() ? 1 : stoi(postId);

        int bId = bookingService.createBooking(2, 1, pId, "2026-11-01 18:00", name + " - " + note + " (" + phone + ")");
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Đăng ký thành công!\",\"data\":{\"id\":\"" + to_string(bId) + "\"}}");
    }

    if (req.method == "GET" && req.path == "/api/application/get-all-applications") {
        ostringstream oss;
        oss << "{\"status\":\"OK\",\"data\":["
            << "{\"id\":\"1\",\"name\":\"Đức Minh\",\"email\":\"minh@gmail.com\",\"phone\":\"0907654321\",\"class\":\"12\",\"note\":\"Ôn thi ĐH\",\"status\":\"approved\",\"postId\":\"1\"},"
            << "{\"id\":\"2\",\"name\":\"Lê Văn Nam\",\"email\":\"nam@gmail.com\",\"phone\":\"0912345678\",\"class\":\"11\",\"note\":\"Bổ trợ kiến thức\",\"status\":\"pending\",\"postId\":\"2\"}"
            << "]}";
        return HttpResponse(200, "application/json", oss.str());
    }

    if (req.method == "GET" && req.path.rfind("/api/application/get-application/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"data\":{\"id\":\"1\",\"status\":\"approved\"}}");
    }

    if (req.method == "GET" && (req.path.rfind("/api/application/get-applications-by-user/", 0) == 0 ||
                                req.path.rfind("/api/application/get-by-student/", 0) == 0 ||
                                req.path.rfind("/api/application/get-by-post/", 0) == 0)) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"data\":[]}");
    }

    if (req.method == "PUT" && req.path.rfind("/api/application/update-status/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Status updated\"}");
    }

    if (req.method == "DELETE" && req.path.rfind("/api/application/delete-application/", 0) == 0) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Deleted\"}");
    }

    // ==========================================
    // 6. EVALUATION APIS
    // ==========================================
    if (req.method == "POST" && req.path == "/api/evaluation/create") {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"message\":\"Evaluation created\"}");
    }
    if (req.method == "GET" && (req.path.rfind("/api/evaluation/get-by-post/", 0) == 0 ||
                                req.path.rfind("/api/evaluation/get-by-tutor/", 0) == 0)) {
        return HttpResponse(200, "application/json", "{\"status\":\"OK\",\"data\":[]}");
    }

    return HttpResponse(404, "application/json", "{\"status\":\"ERR\",\"message\":\"Endpoint not found\"}");
}
