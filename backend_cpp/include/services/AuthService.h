#ifndef AUTH_SERVICE_H
#define AUTH_SERVICE_H

#include <string>
#include <optional>
#include "../models/User.h"
#include "../dsa/HashTable.h"

class AuthService {
private:
    HashTable<std::string, User> usersByUsername;
    HashTable<std::string, bool> registeredEmails;
    HashTable<std::string, bool> registeredPhones;
    int nextUserId;

    std::string hashPassword(const std::string& password) const;

public:
    AuthService();

    bool registerUser(const std::string& username, const std::string& password,
                      const std::string& fullName, const std::string& phone,
                      const std::string& email, Role role, std::string& errorMessage);

    std::optional<User> login(const std::string& username, const std::string& password, std::string& errorMessage);

    std::optional<User> getUser(const std::string& username) const;
    std::optional<User> getUserById(int id) const;
    bool lockUser(int userId, const std::string& reason);
    bool unlockUser(int userId);
    std::vector<User> getAllUsers() const;
    void loadUsers(const std::vector<User>& users);
};

#endif
