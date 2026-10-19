const TutorPostService = require("../services/tutor_post.service.js");
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const createPost = async (req, res) => {
    try {
        let proofUrl = req.body.proof || '';

        if (req.files && req.files.length > 0) {
            proofUrl = await uploadToCloudinary(req.files[0].buffer, 'home/cns/proofs');
        }

        const userId = req.user.id; // tu token
        const { subject, Class, address, description, method, field, schedules } = req.body;
        const response = await TutorPostService.createPost({
            userId, subject, Class, address, description, method, field, proof: proofUrl, schedules
        });
        
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(201).json(response);
    } catch (err) {
        console.log("Create Post Controller Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getPost = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Post ID is required!" });
        }

        const response = await TutorPostService.getPost(id);
        if (response.status === "ERR") return res.status(404).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Post Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const response = await TutorPostService.getAllPosts();
        
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get All Posts Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getPostsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "userId is required!" });
        }

        const response = await TutorPostService.getPostsByUser(userId);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Posts By User Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const updatePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // tu token

        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Post ID is required!" });
        }

        const response = await TutorPostService.updatePost(id, userId, req.body);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Update Post Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // tu token
        const isAdmin = req.user.role === 'admin';

        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Post ID is required!" });
        }

        const response = await TutorPostService.deletePost(id, userId, isAdmin);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Delete Post Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const updatePostStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        
        // Chi admin moi goi duoc (se handle o route bang middleware)
        if (!id || !status) {
            return res.status(400).json({ status: "ERR", message: "Post ID and status are required!" });
        }

        const response = await TutorPostService.updatePostStatus(id, status);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Update Post Status Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
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
