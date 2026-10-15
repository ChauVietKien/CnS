const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { authAdminMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/sign-up', UserController.createUser);
router.post('/sign-in', UserController.loginUser);
router.put('/update-user/:id', authUserMiddleware, UserController.updateUser);
router.get('/get-detail-user/:id', authUserMiddleware, UserController.getDetailUser);
router.delete('/delete-user/:id', authAdminMiddleware, UserController.deleteUser);
router.get('/get-all-users', authAdminMiddleware, UserController.getAllUser);
router.post('/refresh-token', UserController.refresh_token);
router.post('/log-out', UserController.logoutUser);

module.exports = router