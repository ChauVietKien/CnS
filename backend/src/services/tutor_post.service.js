const prisma = require("../config/prisma")

const createPost = async (newPost) => {
    try {
        const { userId, subject, address, Class, description, method, field, proof, schedules } = newPost;

        if (!userId || !subject || !address || !Class || !description || !method || !field || !proof) {
            return {
                status: "ERR",
                message: "Thieu thong tin bat buoc!",
            };
        }
        // 2. Parse schedules TRƯỚC KHI kiểm tra Array
        let parsedSchedules = [];
        try {
            parsedSchedules = typeof schedules === 'string' ? JSON.parse(schedules) : schedules;
        } catch (e) {
            return {
                status: "ERR",
                message: "Lich hoc khong dung dinh dang JSON!",
            };
        }
        
        // 3. Kiểm tra mảng schedules sau khi đã parse
        if (!Array.isArray(parsedSchedules) || parsedSchedules.length === 0) {
            return {
                status: "ERR",
                message: "Can it nhat 1 lich hoc!",
            };
        }
        
        // Kiem tra user co phai tutor khong va lay tutorProfile
        const tutorProfile = await prisma.tutor_profile.findUnique({
            where: { userId: userId },
        });
        
        if (!tutorProfile) {
            return {
                status: "ERR",
                message: "Chi khi la gia su moi dang bai duoc!",
            };
        }

        const createdPost = await prisma.tutor_post.create({
            data: {
                subject,
                Class,
                address,
                description,
                method,
                tutorId: tutorProfile.id,
                field,
                proof,
                schedules: {
                    create: parsedSchedules.map(s => ({
                        day: s.day,
                        startTime: s.startTime,
                        endTime: s.endTime,
                    })),
                },
            },
            include: {
                schedules: true,
            },
        });

        return {
            status: "OK",
            message: "Create post success!",
            data: createdPost,
        };
    } catch (err) {
        console.log("Create post failed!", err);
        return {
            status: "ERR",
            message: "Internal Server Error"
        };
    }
};

const getPost = async (id) => {
    try {
        const post = await prisma.tutor_post.findUnique({
            where: { id },
            include: {
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                        user: {
                            select: {
                                id: true,
                                email: true,
                            }
                        }
                    }
                },
                schedules: {
                    select: {
                        id: true,
                        day: true,
                        startTime: true,
                        endTime: true,
                    }
                },
                evaluations: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                    }
                }
            }
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        return {
            status: "OK",
            message: "Get post success!",
            data: post,
        }
    } catch (err) {
        console.log("Get post failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getAllPosts = async () => {
    try {
        const posts = await prisma.tutor_post.findMany({
            where: { status: 'approved'},
            include: {
                tutor: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                schedules: {
                    select: {
                        day: true,
                        startTime: true,
                        endTime: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get all posts success!",
            data: posts,
        }
    } catch (err) {
        console.log("Get all posts failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getPostsByUser = async (userId) => {
    try {
        // Tim tutor profile tu userId truoc
        const tutorProfile = await prisma.tutor_profile.findUnique({
            where: { userId: userId },
        });

        if (!tutorProfile) {
            return {
                status: "OK",
                message: "User khong co tutor profile!",
                data: [],
            }
        }

        const posts = await prisma.tutor_post.findMany({
            where: { tutorId: tutorProfile.id },
            include: {
                schedules: {
                    select: {
                        day: true,
                        startTime: true,
                        endTime: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get posts by user success!",
            data: posts,
        }
    } catch (err) {
        console.log("Get posts by user failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const updatePost = async (id, userId, data) => {
    try {
        const post = await prisma.tutor_post.findUnique({
            where: { id },
            include: { tutor: true },
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        // Kiem tra qua tutor profile
        if (post.tutor.userId !== userId) {
            return { status: "ERR", message: "Khong co quyen chinh sua bai dang nay!" }
        }

        const { schedules, ...postData } = data;

        // Build update data, chi update cac field duoc gui len
        const updateData = {};
        if (postData.subject !== undefined) updateData.subject = postData.subject;
        if (postData.Class !== undefined) updateData.Class = postData.Class;
        if (postData.address !== undefined) updateData.address = postData.address;
        if (postData.description !== undefined) updateData.description = postData.description;
        if (postData.method !== undefined) updateData.method = postData.method;
        if (postData.field !== undefined) updateData.field = postData.field;
        if (postData.proof !== undefined) updateData.proof = postData.proof;

        // Neu co schedules moi, xoa het cu va tao lai
        if (schedules && Array.isArray(schedules) && schedules.length > 0) {
            updateData.schedules = {
                deleteMany: {},
                create: schedules.map(s => ({
                    day: s.day,
                    startTime: s.startTime,
                    endTime: s.endTime,
                })),
            };
        }

        const updatedPost = await prisma.tutor_post.update({
            where: { id },
            data: updateData,
            include: {
                schedules: true,
            },
        });

        return {
            status: "OK",
            message: "Update post success!",
            data: updatedPost,
        }
    } catch (err) {
        console.log("Update post failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const deletePost = async (id, userId, isAdmin) => {
    try {
        const post = await prisma.tutor_post.findUnique({
            where: { id },
            include: { tutor: true },
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        if (post.tutor.userId !== userId && !isAdmin) {
            return { status: "ERR", message: "Khong co quyen xoa bai dang nay!" }
        }

        // Schedule se tu dong bi xoa nho onDelete: Cascade
        await prisma.tutor_post.delete({
            where: { id },
        });

        return {
            status: "OK",
            message: "Delete post success!",
        }
    } catch (err) {
        console.log("Delete post failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const updatePostStatus = async (id, status) => {
    try {
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return { status: "ERR", message: "Status không hợp lệ!" }
        }

        const post = await prisma.tutor_post.findUnique({
            where: { id },
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        const updatedPost = await prisma.tutor_post.update({
            where: { id },
            data: { status: status },
        });

        return {
            status: "OK",
            message: "Update post status success!",
            data: updatedPost,
        }
    } catch (err) {
        console.log("Update post status failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

module.exports = {
    createPost,
    getPost,
    getAllPosts,
    getPostsByUser,
    updatePost,
    deletePost,
    updatePostStatus,
}