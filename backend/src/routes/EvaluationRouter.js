const express = require("express");
const router = express.Router();
const EvaluationController = require("../controllers/evaluation.controller");
const { authAdminMiddleware, authMiddlewareOnlyToken } = require("../middleware/authMiddleware");

router.post('/create', authMiddlewareOnlyToken, EvaluationController.createEvaluation);
router.get('/get-evaluation/:id', EvaluationController.getEvaluation);
router.get('/get-by-tutor/:tutorId', EvaluationController.getEvaluationsByTutor);
router.get('/get-by-post/:postId', EvaluationController.getEvaluationsByPost);
router.delete('/delete-evaluation/:id', authAdminMiddleware, EvaluationController.deleteEvaluation);

module.exports = router;
