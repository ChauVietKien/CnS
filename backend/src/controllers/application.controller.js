const ApplicationService = require("../services/application.service.js");

const createApplication = async (req, res) => {
    try {
        const userId = req.user.id; // tu token
        const { name, email, className } = req.body; 
        // FE nen gui truong className thay vi class vi no la reserved keyword trong JS

        const response = await ApplicationService.createApplication({
            userId, name, email, className
        });
        
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(201).json(response);
    } catch (err) {
        console.log("Create Application Controller Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getApplication = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Application ID is required!" });
        }

        const response = await ApplicationService.getApplication(id);
        if (response.status === "ERR") return res.status(404).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Application Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getAllApplications = async (req, res) => {
    try {
        const { status } = req.query; // filter
        const response = await ApplicationService.getAllApplications(status);
        
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get All Applications Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getApplicationsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "userId is required!" });
        }

        const response = await ApplicationService.getApplicationsByUser(userId);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Applications By User Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const updateApplicationStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        
        if (!id || !status) {
            return res.status(400).json({ status: "ERR", message: "Application ID and status are required!" });
        }

        const response = await ApplicationService.updateApplicationStatus(id, status);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Update Application Status Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const deleteApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // tu token
        const isAdmin = req.user.isAdmin; // tu token

        if (!id) {
            return res.status(400).json({ status: "ERR", message: "Application ID is required!" });
        }

        const response = await ApplicationService.deleteApplication(id, userId, isAdmin);
        if (response.status === "ERR") return res.status(400).json(response);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Delete Application Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
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
