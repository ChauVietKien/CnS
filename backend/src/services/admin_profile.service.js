const prisma = require("../config/prisma")

const createAdminProfile = async (data) => {
    try {
        const { userId, name } = data;

        if (!userId || !name) {
            return { status: "ERR", message: "userId va name la bat buoc!" }
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return { status: "ERR", message: "User not found!" }
        }

        const existing = await prisma.adminProfile.findUnique({ where: { userId } });
        if (existing) {
            return { status: "ERR", message: "Admin profile da ton tai!" }
        }

        const [profile] = await prisma.$transaction([
            prisma.adminProfile.create({
                data: { userId, name },
            }),
            prisma.user.update({
                where: { id: userId },
                data: { role: "admin" },
            })
        ]);

        return { status: "OK", message: "Create admin profile success!", data: profile }
    } catch (err) {
        console.log("Create admin profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getAdminProfile = async (userId) => {
    try {
        const profile = await prisma.adminProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, email: true, role: true } },
            }
        });

        if (!profile) {
            return { status: "ERR", message: "Admin profile not found!" }
        }

        return { status: "OK", message: "Get admin profile success!", data: profile }
    } catch (err) {
        console.log("Get admin profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const updateAdminProfile = async (userId, data) => {
    try {
        const profile = await prisma.adminProfile.findUnique({ where: { userId } });
        if (!profile) {
            return { status: "ERR", message: "Admin profile not found!" }
        }

        const updated = await prisma.adminProfile.update({
            where: { userId },
            data: { name: data.name },
        });

        return { status: "OK", message: "Update admin profile success!", data: updated }
    } catch (err) {
        console.log("Update admin profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

module.exports = {
    createAdminProfile,
    getAdminProfile,
    updateAdminProfile,
}
