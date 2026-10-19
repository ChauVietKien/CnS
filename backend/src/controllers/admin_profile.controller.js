const AdminProfileService = require("../services/admin_profile.service.js");

const createAdminProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;

        const response = await AdminProfileService.createAdminProfile({ userId, name });
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(201).json(response);
    } catch (err) {
        console.log("Create Admin Profile Controller Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getAdminProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "userId is required!" });
        }

        const response = await AdminProfileService.getAdminProfile(userId);
        if (response.status === "ERR") return res.status(404).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Admin Profile Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const updateAdminProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "userId is required!" });
        }

        const response = await AdminProfileService.updateAdminProfile(userId, req.body);
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Update Admin Profile Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

module.exports = {
    createAdminProfile,
    getAdminProfile,
    updateAdminProfile,
}
