const UserService = require("../services/user.service.js")
const JWTService = require("../services/jwt.service.js")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require("../config/prisma.js");

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    maxAge: 7*24*60*60*1000,
    path: "/",
});

const getCookieOptionsCl = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    path: "/",
});

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "ERR", message: "Email and password is required" });
        }

        const response = await UserService.createUser(req.body);
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(201).json(response);
    } catch (err) {
        console.log("Create User Controller Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: "ERR", message: "Email and password is required" });
        }

        const response = await UserService.loginUser(req.body);
        if (response.status === "ERR" || !response?.refresh_token) return res.status(400).json(response);

        res.cookie('refresh_token', response.refresh_token, getCookieOptions());
        const { refresh_token, ...resBody } = response;
        return res.status(200).json(resBody);
    } catch (err) {
        console.log("Login Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "UserId is required!" });
        }

        const response = await UserService.updateUser(userId, req.body);
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Update User Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "UserId is required!" });
        }

        const response = await UserService.deleteUser(userId);
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Delete User Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser();
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Get All User Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: "ERR", message: "UserId is required!" });
        }

        const response = await UserService.getDetailUser(userId);
        if (response.status === "ERR") return res.status(400).json(response);

        return res.status(200).json(response);
    } catch (err) {
        console.log("Get Details Error:", err);
        return res.status(500).json({ status: "ERR", message: "Internal Server Error" });
    }
}

const refresh_token = async (req, res) => {
    try {
        const token_refresh = req.cookies.refresh_token;
        if (!token_refresh) {
            res.status(401).json({status: "ERR", message: "Thieu token!"})
        }
        
        const results = await JWTService.refreshTokenJwtService(token_refresh);
        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({message: err.message || "Loi he thong!"});
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token', getCookieOptionsCl());
        return res.status(200).json({ status: "OK", message: "Logout Sc!" });
    } catch (e) {
        return res.status(500).json({message: e.message || "Loi he thong!"});
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refresh_token,
    logoutUser
}