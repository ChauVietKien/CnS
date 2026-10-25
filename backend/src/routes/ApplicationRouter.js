const express = require("express");
const router = express.Router();
const ApplicationController = require("../controllers/application.controller");
const {
  authAdminMiddleware,
  authMiddlewareOnlyToken,
} = require("../middleware/authMiddleware");

router.post(
  "/create",
  authMiddlewareOnlyToken,
  ApplicationController.createApplication,
);
router.get(
  "/get-application/:id",
  authMiddlewareOnlyToken,
  ApplicationController.getPersonalApplication,
);
router.get(
  "/get-all-applications",
  authAdminMiddleware,
  ApplicationController.getAllApplications,
);
router.get(
  "/get-by-post/:postId",
  authMiddlewareOnlyToken,
  ApplicationController.getApplicationsByPost,
);
router.get(
  "/get-by-student/:studentId",
  authMiddlewareOnlyToken,
  ApplicationController.getApplicationsByStudent,
);
router.put(
  "/update-status/:id",
  authAdminMiddleware,
  ApplicationController.updateApplicationStatus,
);
router.delete(
  "/delete-application/:id",
  authAdminMiddleware,
  ApplicationController.deleteApplication,
);

module.exports = router;
