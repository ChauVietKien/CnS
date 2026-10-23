#include "../../include/services/AuthService.h"

using namespace std;

AuthService::AuthService() : nextUserId(1) {}

string AuthService::hashPassword(const string& password) const {
    unsigned long long hash = 5381;
    for (char c : password) {
        hash = ((hash << 5) + hash) + c;
    }
    return to_string(hash);
}

bool AuthService::registerUser(const string& username, const string& password,
                              const string& fullName, const string& phone,
                              const string& email, Role role, string& errorMessage) {
    if (username.empty() || password.empty() || fullName.empty()) {
        errorMessage = "Missing required fields";
        return false;
    }

    if (usersByUsername.contains(username)) {
        errorMessage = "Username already exists";
        return false;
    }

    if (!email.empty() && registeredEmails.contains(email)) {
        errorMessage = "Email already registered";
        return false;
    }

    if (!phone.empty() && registeredPhones.contains(phone)) {
        errorMessage = "Phone already registered";
        return false;
    }

    int id = nextUserId++;
    string pwdHash = hashPassword(password);
    User newUser(id, username, pwdHash, fullName, phone, email, role);

    usersByUsername.insert(username, newUser);
    if (!email.empty()) registeredEmails.insert(email, true);
    if (!phone.empty()) registeredPhones.insert(phone, true);

    return true;
}

optional<User> AuthService::login(const string& username, const string& password, string& errorMessage) {
    User user;
    if (!usersByUsername.find(username, user)) {
        errorMessage = "Invalid username or password";
        return nullopt;
    }

    if (user.getIsLocked()) {
        errorMessage = "Account is locked: " + user.getLockReason();
        return nullopt;
    }

    if (user.getPasswordHash() != hashPassword(password)) {
        errorMessage = "Invalid username or password";
        return nullopt;
    }

    return user;
}

optional<User> AuthService::getUser(const string& username) const {
    User user;
    if (usersByUsername.find(username, user)) {
        return user;
    }
    return nullopt;
}

bool AuthService::lockUser(int userId, const string& reason) {
    vector<User> users = usersByUsername.getAllValues();
    for (auto& u : users) {
        if (u.getId() == userId) {
            u.setIsLocked(true);
            u.setLockReason(reason);
            usersByUsername.insert(u.getUsername(), u);
            return true;
        }
    }
    return false;
}

bool AuthService::unlockUser(int userId) {
    vector<User> users = usersByUsername.getAllValues();
    for (auto& u : users) {
        if (u.getId() == userId) {
            u.setIsLocked(false);
            u.setLockReason("");
            usersByUsername.insert(u.getUsername(), u);
            return true;
        }
    }
    return false;
}

vector<User> AuthService::getAllUsers() const {
    return usersByUsername.getAllValues();
}

void AuthService::loadUsers(const vector<User>& users) {
    for (const auto& u : users) {
        usersByUsername.insert(u.getUsername(), u);
        if (!u.getEmail().empty()) registeredEmails.insert(u.getEmail(), true);
        if (!u.getPhone().empty()) registeredPhones.insert(u.getPhone(), true);
        if (u.getId() >= nextUserId) {
            nextUserId = u.getId() + 1;
        }
    }
}
