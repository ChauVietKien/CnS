const prisma = require("../config/prisma")

const createPost = async (newPost) => {
    try {
        const { subject, description, userId, time } = newPost;

        if (!userId || !subject || !description || !time) {
            return {
                status: "ERR",
                message: "Thieu thong tin bat buoc (subject, description, time)!",
            }
        }

        // Kiem tra user co phai tutor khong bang cach tim trong bang User
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== "tutor") {
            return {
                status: "ERR",
                message: "Chi khi la gia su moi dang bai duoc!",
            }
        }

        const createdPost = await prisma.tutor_post.create({
            data: {
                subject: subject,
                description: description,
                userId: userId,
                time: new Date(time),
            }
        })

        return {
            status: "OK",
            message: "Create post success!",
            data: createdPost,
        }
    } catch (err) {
        console.log("Create post failed!", err);
        return {
            status: "ERR",
            message: "Internal Server Error"
        }
    }
}

const getPost = async (id) => {
    try {
        const post = await prisma.tutor_post.findUnique({
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

const getAllPosts = async (status) => {
    try {
        const whereClause = status ? { status: status } : {};
        const posts = await prisma.tutor_post.findMany({
            where: {whereClause},
            include: {
                user : {
                    id: true,
                    name: true,
                },
            },
            orderBy: { createdAt: desc },
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
        const posts = await prisma.tutor_post.findMany({
            where: { userId: userId },
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
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        if (post.userId !== userId) {
            return { status: "ERR", message: "Khong co quyen chinh sua bai dang nay!" }
        }

        const updatedPost = await prisma.tutor_post.update({
            where: { id },
            data: {
                subject: data.subject,
                description: data.description,
                time: data.time ? new Date(data.time) : undefined,
            }
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
        });

        if (!post) {
            return { status: "ERR", message: "Post not found!" }
        }

        if (post.userId !== userId && !isAdmin) {
            return { status: "ERR", message: "Khong co quyen xoa bai dang nay!" }
        }

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