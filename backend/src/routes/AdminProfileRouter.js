const express = require("express");
const router = express.Router();
const AdminProfileController = require("../controllers/admin_profile.controller");
const { authAdminMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authAdminMiddleware, AdminProfileController.createAdminProfile);
router.get('/get-profile/:userId', authAdminMiddleware, AdminProfileController.getAdminProfile);
router.put('/update-profile/:userId', authAdminMiddleware, AdminProfileController.updateAdminProfile);

module.exports = router;
