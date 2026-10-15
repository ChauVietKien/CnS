const bcrypt = require("bcrypt");
const prisma = require("../config/prisma")
const { genneralAccessToken, refreshAccessToken, refreshTokenJwtService } = require("./jwt.service");

const createUser = async (newUser) => {

    try {

        const { email, name, age, phone, role, address, password, isAdmin } = newUser

        if (!email || !password) {
            return {
                status: "ERR",
                message: "phone and password are compulsory!",
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
                name: name || "Client",
                email: email,
                phone: phone,
                isAdmin: isAdmin === true,
                password: hash,
                address: address,
                age: age,
                role: role
            },
            //choice
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
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
            id: infoUser?.id,
            isAdmin: infoUser?.isAdmin === true,
        });

        const refresh_token = refreshAccessToken({
            id: infoUser?.id,
            isAdmin: infoUser?.isAdmin === true,
        });

        return {
            status: "OK",
            message: "Login success",
            access_token,
            refresh_token,
            data: {
                id: infoUser.id,
                name: infoUser.name,
                email: infoUser.email,
                role: infoUser.role,
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

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                age: Number(data.age),
                phone: data.phone,
                role: data.role,
                address: data.address,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                role: true,
                createdAt: true,
            }
        });

        return {
            status: "OK",
            message: "Update Success",
            updatedUser,
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
                email: true,
                id: true,
                name: true,
                age: true,
                phone: true,
                role: true,
                address: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
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
                email: true,
                id: true,
                name: true,
                age: true,
                phone: true,
                role: true,
                address: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
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
            message: "Get d failed",
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