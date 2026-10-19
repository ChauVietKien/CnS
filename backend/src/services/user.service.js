const bcrypt = require("bcrypt");
const prisma = require("../config/prisma")
const { genneralAccessToken, refreshAccessToken } = require("./jwt.service");

const createUser = async (newUser) => {
    try {
        const { email, password, role } = newUser;

        if (!email || !password) {
            return {
                status: "ERR",
                message: "Email and password are required!",
            }
        };

        const checkUser = await prisma.user.findUnique({
            where: { email },
        })

        if (checkUser !== null) {
            return {
                status: "ERR",
                message: "Account existed!",
            }
        };

        const hash = await bcrypt.hash(password, 10);

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                password: hash,
                role: role || 'student',
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if (createdUser) {
            return {
                status: "OK",
                message: "Created User Sc!",
                data: createdUser,
            }
        };
    } catch (error) {
        console.log("Create user failed", error);
        return {
            status: "ERR",
            message: "Internal Server Error"
        }
    }
}

const loginUser = async (userLogin) => {
    try {
        const { email, password } = userLogin;

        if (!email || !password) {
            return {
                status: "ERR",
                message: "email or password didn't fill"
            }
        };

        const infoUser = await prisma.user.findUnique({
            where: { email },
            include: {
                adminProfile: true,
                tutorProfile: true,
                studentProfile: true,
            }
        });

        if (!infoUser) {
            return {
                status: "ERR",
                message: "Email or password is incorrect"
            }
        }

        const iscorrectpassword = await bcrypt.compare(password, infoUser.password);

        if (!iscorrectpassword) {
            return {
                status: "ERR",
                message: "Email or password is incorrect"
            }
        }

        const access_token = genneralAccessToken({
            id: infoUser.id,
            role: infoUser.role,
        });

        const refresh_token = refreshAccessToken({
            id: infoUser.id,
            role: infoUser.role,
        });

        // Lay ten tu profile tuong ung
        let profileName = null;
        if (infoUser.role === 'admin' && infoUser.adminProfile) {
            profileName = infoUser.adminProfile.name;
        } else if (infoUser.role === 'tutor' && infoUser.tutorProfile) {
            profileName = infoUser.tutorProfile.name;
        } else if (infoUser.studentProfile) {
            profileName = infoUser.studentProfile.name;
        }

        return {
            status: "OK",
            message: "Login success",
            access_token,
            refresh_token,
            data: {
                id: infoUser.id,
                email: infoUser.email,
                role: infoUser.role,
                name: profileName,
            }
        }
    } catch (err) {
        console.log("Login User", err);
        return {
            status: "ERR",
            message: "login failed",
        }
    }
}

const updateUser = async (id, data) => {
    try {
        const checkUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!checkUser) {
            return {
                status: "ERR",
                message: "User didn't existed",
            }
        }

        const updateData = {};
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return {
            status: "OK",
            message: "Update Success",
            data: updatedUser,
        }
    } catch (err) {
        console.log("Update User Error:", err);
        return {
            status: "ERR",
            message: "Internal Server Error",
        }
    }
}

const deleteUser = async (id) => {
    try {
        const checkUser = await prisma.user.findUnique({
            where: { id },
        })

        if (!checkUser) {
            return {
                status: "ERR",
                message: "User doesn't exist",
            }
        }

        await prisma.user.delete({
            where: { id },
        });

        return {
            status: "OK",
            message: "Delete user success",
        }
    } catch (err) {
        console.log("Delete user failed", err)
        return {
            status: "ERR",
            message: "Can't delete user",
        }
    }
}

const getAllUser = async () => {
    try {
        const alluser = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                adminProfile: { select: { name: true } },
                tutorProfile: { select: { name: true } },
                studentProfile: { select: { name: true } },
            }
        });

        return {
            status: "OK",
            message: "Get all user success",
            data: alluser,
        }
    } catch (err) {
        console.log("Get all user failed:", err);
        return {
            status: "ERR",
            message: "Get all user failed",
        }
    }
}

const getDetailUser = async (id) => {
    try {
        const checkUser = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                adminProfile: true,
                tutorProfile: true,
                studentProfile: true,
            }
        })

        if (!checkUser) {
            return {
                status: "ERR",
                message: "User doesn't exist",
            }
        }

        return {
            status: "OK",
            message: "Get user success",
            data: checkUser
        }
    } catch (err) {
        console.log("Get detail failed", err);
        return {
            status: "ERR",
            message: "Get detail failed",
        }
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
}