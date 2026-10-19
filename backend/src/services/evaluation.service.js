const prisma = require("../config/prisma")

const createEvaluation = async (newEvaluation) => {
    try {
        const { tutorId, tutor_postId, rating, comment } = newEvaluation;

        if (!tutorId || !tutor_postId || rating === undefined) {
            return {
                status: "ERR",
                message: "Thieu thong tin bat buoc (tutorId, tutor_postId, rating)!",
            }
        }

        if (rating < 1 || rating > 5) {
            return {
                status: "ERR",
                message: "Rating phai nam trong khoang tu 1 den 5!",
            }
        }

        // Kiem tra tutor_profile co ton tai khong
        const tutor = await prisma.tutor_profile.findUnique({
            where: { id: tutorId },
        });

        if (!tutor) {
            return { status: "ERR", message: "Tutor profile not found!" }
        }

        // Kiem tra tutor_post co ton tai khong
        const post = await prisma.tutor_post.findUnique({
            where: { id: tutor_postId },
        });

        if (!post) {
            return { status: "ERR", message: "Tutor post not found!" }
        }

        const createdEvaluation = await prisma.evaluation.create({
            data: {
                tutorId: tutorId,
                tutor_postId: tutor_postId,
                rating: Number(rating),
                comment: comment || "",
            }
        });

        return {
            status: "OK",
            message: "Create evaluation success!",
            data: createdEvaluation,
        }
    } catch (err) {
        console.log("Create evaluation failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getEvaluation = async (id) => {
    try {
        const evaluation = await prisma.evaluation.findUnique({
            where: { id },
            include: {
                tutor: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                tutor_post: {
                    select: {
                        id: true,
                        subject: true,
                    }
                }
            },
        })

        if (!evaluation) {
            return { status: "ERR", message: "Evaluation not found!" }
        }

        return {
            status: "OK",
            message: "Get evaluation success!",
            data: evaluation,
        }
    } catch (err) {
        console.log("Get evaluation failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getEvaluationsByTutor = async (tutorId) => {
    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { tutorId: tutorId },
            include: {
                tutor_post: {
                    select: {
                        subject: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get evaluations by tutor success!",
            data: evaluations,
        }
    } catch (err) {
        console.log("Get evaluations by tutor failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const getEvaluationsByPost = async (postId) => {
    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { tutor_postId: postId },
            include: {
                tutor: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: "OK",
            message: "Get evaluations by post success!",
            data: evaluations,
        }
    } catch (err) {
        console.log("Get evaluations by post failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

const deleteEvaluation = async (id) => {
    try {
        const evaluation = await prisma.evaluation.findUnique({
            where: { id },
        });

        if (!evaluation) {
            return { status: "ERR", message: "Evaluation not found!" }
        }

        await prisma.evaluation.delete({
            where: { id },
        });

        return {
            status: "OK",
            message: "Delete evaluation success!",
        }
    } catch (err) {
        console.log("Delete evaluation failed!", err);
        return { status: "ERR", message: "Internal Server Error" }
    }
}

module.exports = {
    createEvaluation,
    getEvaluation,
    getEvaluationsByTutor,
    getEvaluationsByPost,
    deleteEvaluation,
}
