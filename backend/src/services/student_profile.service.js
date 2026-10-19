const prisma = require("../config/prisma")

const createStudentProfile = async (data) => {
    try {
        const { userId, name, phone } = data;

        if (!userId || !name) {
            return { status: "ERR", message: "userId va name la bat buoc!" }
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return { status: "ERR", message: "User not found!" }
        }

        const existing = await prisma.studentProfile.findUnique({ where: { userId } });
        if (existing) {
            return { status: "ERR", message: "Student profile da ton tai!" }
        }

        const profile = await prisma.studentProfile.create({
            data: { userId, name, phone: phone || null },
        });

        return { status: "OK", message: "Create student profile success!", data: profile }
    } catch (err) {
        console.log("Create student profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getStudentProfile = async (userId) => {
    try {
        const profile = await prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                user: { select: { id: true, email: true, role: true } },
                applications: { orderBy: { createdAt: "desc" }, take: 10 },
            }
        });

        if (!profile) {
            return { status: "ERR", message: "Student profile not found!" }
        }

        return { status: "OK", message: "Get student profile success!", data: profile }
    } catch (err) {
        console.log("Get student profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const updateStudentProfile = async (userId, data) => {
    try {
        const profile = await prisma.studentProfile.findUnique({ where: { userId } });
        if (!profile) {
            return { status: "ERR", message: "Student profile not found!" }
        }

        const updateData = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.phone !== undefined) updateData.phone = data.phone;

        const updated = await prisma.studentProfile.update({
            where: { userId },
            data: updateData,
        });

        return { status: "OK", message: "Update student profile success!", data: updated }
    } catch (err) {
        console.log("Update student profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const deleteStudentProfile = async (userId) => {
    try {
        const profile = await prisma.studentProfile.findUnique({ where: { userId } });
        if (!profile) {
            return { status: "ERR", message: "Student profile not found!" }
        }

        await prisma.studentProfile.delete({ where: { userId } });

        return { status: "OK", message: "Delete student profile success!" }
    } catch (err) {
        console.log("Delete student profile failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

module.exports = {
    createStudentProfile,
    getStudentProfile,
    updateStudentProfile,
    deleteStudentProfile,
}
