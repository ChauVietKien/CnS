const express = require("express");
const router = express.Router();
const StudentProfileController = require("../controllers/student_profile.controller");
const { authAdminMiddleware, authMiddlewareOnlyToken } = require("../middleware/authMiddleware");

router.post('/create', authMiddlewareOnlyToken, StudentProfileController.createStudentProfile);
router.get('/get-profile/:userId', StudentProfileController.getStudentProfile);
router.put('/update-profile/:userId', authMiddlewareOnlyToken, StudentProfileController.updateStudentProfile);
router.delete('/delete-profile/:userId', authAdminMiddleware, StudentProfileController.deleteStudentProfile);

module.exports = router;
