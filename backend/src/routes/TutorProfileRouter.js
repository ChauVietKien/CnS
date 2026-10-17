const express = require("express");
const router = express.Router();
const TutorProfileController = require("../controllers/tutor_profile.controller");
const { authAdminMiddleware, authMiddlewareOnlyToken } = require("../middleware/authMiddleware");

router.post('/create', authMiddlewareOnlyToken, TutorProfileController.createTutor);
router.get('/get-profile/:userId', TutorProfileController.getTutorProfile);
router.get('/get-all-tutors', TutorProfileController.getAllTutors);
router.put('/update-profile/:userId', authMiddlewareOnlyToken, TutorProfileController.updateTutorProfile);
router.delete('/delete-profile/:userId', authAdminMiddleware, TutorProfileController.deleteTutorProfile);

module.exports = router;
