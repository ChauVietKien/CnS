#ifndef USER_H
#define USER_H

#include <string>

enum class Role {
    STUDENT,
    TUTOR,
    ADMIN
};

class User {
private:
    int id;
    std::string username;
    std::string passwordHash;
    std::string fullName;
    std::string phone;
    std::string email;
    Role role;
    bool isLocked;
    std::string lockReason;

public:
    User();
    User(int id, const std::string& username, const std::string& passwordHash, 
         const std::string& fullName, const std::string& phone, const std::string& email, Role role);

    int getId() const;
    void setId(int newId);

    std::string getUsername() const;
    void setUsername(const std::string& newUsername);

    std::string getPasswordHash() const;
    void setPasswordHash(const std::string& newPasswordHash);

    std::string getFullName() const;
    void setFullName(const std::string& newFullName);

    std::string getPhone() const;
    void setPhone(const std::string& newPhone);

    std::string getEmail() const;
    void setEmail(const std::string& newEmail);

    Role getRole() const;
    void setRole(Role newRole);

    bool getIsLocked() const;
    void setIsLocked(bool locked);

    std::string getLockReason() const;
    void setLockReason(const std::string& reason);
};

#endif
