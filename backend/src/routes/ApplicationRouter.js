const express = require("express");
const router = express.Router();
const ApplicationController = require("../controllers/application.controller");
const { authAdminMiddleware, authMiddlewareOnlyToken } = require("../middleware/authMiddleware");

router.post('/create', authMiddlewareOnlyToken, ApplicationController.createApplication);
router.get('/get-application/:id', authMiddlewareOnlyToken, ApplicationController.getApplication);
router.get('/get-all-applications', authAdminMiddleware, ApplicationController.getAllApplications);
router.get('/get-applications-by-user/:userId', authMiddlewareOnlyToken, ApplicationController.getApplicationsByUser);
router.put('/update-status/:id', authAdminMiddleware, ApplicationController.updateApplicationStatus);
router.delete('/delete-application/:id', authMiddlewareOnlyToken, ApplicationController.deleteApplication);

module.exports = router;
