#include "../../include/models/User.h"

using namespace std;

User::User() 
    : id(0), username(""), passwordHash(""), fullName(""), phone(""), email(""), 
      role(Role::STUDENT), isLocked(false), lockReason("") {}

User::User(int id, const string& username, const string& passwordHash, 
           const string& fullName, const string& phone, const string& email, Role role)
    : id(id), username(username), passwordHash(passwordHash), fullName(fullName), 
      phone(phone), email(email), role(role), isLocked(false), lockReason("") {}

int User::getId() const { return id; }
void User::setId(int newId) { id = newId; }

string User::getUsername() const { return username; }
void User::setUsername(const string& newUsername) { username = newUsername; }

string User::getPasswordHash() const { return passwordHash; }
void User::setPasswordHash(const string& newPasswordHash) { passwordHash = newPasswordHash; }

string User::getFullName() const { return fullName; }
void User::setFullName(const string& newFullName) { fullName = newFullName; }

string User::getPhone() const { return phone; }
void User::setPhone(const string& newPhone) { phone = newPhone; }

string User::getEmail() const { return email; }
void User::setEmail(const string& newEmail) { email = newEmail; }

Role User::getRole() const { return role; }
void User::setRole(Role newRole) { role = newRole; }

bool User::getIsLocked() const { return isLocked; }
void User::setIsLocked(bool locked) { isLocked = locked; }

string User::getLockReason() const { return lockReason; }
void User::setLockReason(const string& reason) { lockReason = reason; }
