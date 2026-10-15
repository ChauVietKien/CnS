const prisma = require("../config/prisma")

const createApplication = async (newApplication) => {
    try {
        const { name, email, className, userId } = newApplication;

        if (!name || !email || !className || !userId) {
            return {
                status: "ERR",
                message: "Thieu thong tin bat buoc (name, email, class, userId)!",
            }
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return { status: "ERR", message: "User not found!" }
        }

        const createdApp = await prisma.application.create({
            data: {
                name: name,
                email: email,
                class: className, // using className variable because class is a reserved keyword
                userId: userId,
            }
        });

        return {
            status: "OK",
            message: "Create application success!",
            data: createdApp,
        }
    } catch (err) {
        console.log("Create application failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getApplication = async (id) => {
    try {
        const app = await prisma.application.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
            }
        });

        if (!app) {
            return { status: "ERR", message: "Application not found!" }
        }

        return {
            status: "OK",
            message: "Get application success!",
            data: app,
        }
    } catch (err) {
        console.log("Get application failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getAllApplications = async (status) => {
    try {
        const whereClause = status ? { status: status } : {};
        const apps = await prisma.application.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get all applications success!",
            data: apps,
        }
    } catch (err) {
        console.log("Get all applications failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getApplicationsByUser = async (userId) => {
    try {
        const apps = await prisma.application.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get applications by user success!",
            data: apps,
        }
    } catch (err) {
        console.log("Get applications by user failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const updateApplicationStatus = async (id, status) => {
    try {
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return { status: "ERR", message: "Status không hợp lệ!" }
        }

        const app = await prisma.application.findUnique({
            where: { id },
        });

        if (!app) {
            return { status: "ERR", message: "Application not found!" }
        }

        const updatedApp = await prisma.application.update({
            where: { id },
            data: { status: status },
        });

        return {
            status: "OK",
            message: "Update application status success!",
            data: updatedApp,
        }
    } catch (err) {
        console.log("Update application status failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const deleteApplication = async (id, userId, isAdmin) => {
    try {
        const app = await prisma.application.findUnique({
            where: { id },
        });

        if (!app) {
            return { status: "ERR", message: "Application not found!" }
        }

        if (app.userId !== userId && !isAdmin) {
            return { status: "ERR", message: "Khong co quyen xoa don nay!" }
        }

        await prisma.application.delete({
            where: { id },
        });

        return {
            status: "OK",
            message: "Delete application success!",
        }
    } catch (err) {
        console.log("Delete application failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

module.exports = {
    createApplication,
    getApplication,
    getAllApplications,
    getApplicationsByUser,
    updateApplicationStatus,
    deleteApplication,
}
