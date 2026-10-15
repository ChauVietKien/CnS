const EvaluationService = require("../services/evaluation.service.js");

const createEvaluation = async (req, res) => {
    try {
        const { tutorId, tutor_postId, rating, comment } = req.body;

        const response = await EvaluationService.createEvaluation({
            tutorId, tutor_postId, rating, comment
        });
        
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(201).json(response);
    } catch (err) {
        console.log("Create Evaluation Controller Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getEvaluation = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Evaluation ID is required!" });
        }

        const response = await EvaluationService.getEvaluation(id);
        if (response.status === "ERR") return res.status(404).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Evaluation Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getEvaluationsByTutor = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        if (!tutorId) {
            return res.status(400).json({ status: "ERR", message: "tutorId is required!" });
        }

        const response = await EvaluationService.getEvaluationsByTutor(tutorId);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Evaluations By Tutor Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getEvaluationsByPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({ status: "ERR", message: "postId is required!" });
        }

        const response = await EvaluationService.getEvaluationsByPost(postId);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Evaluations By Post Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const deleteEvaluation = async (req, res) => {
    try {
        const id = req.params.id;
        // Chi admin moi duoc xoa, dieu nay duoc kiem tra o route (authAdminMiddleware)

        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Evaluation ID is required!" });
        }

        const response = await EvaluationService.deleteEvaluation(id);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Delete Evaluation Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

module.exports = {
    createEvaluation,
    getEvaluation,
    getEvaluationsByTutor,
    getEvaluationsByPost,
    deleteEvaluation,
}
