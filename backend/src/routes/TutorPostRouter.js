const express = require("express");
const router = express.Router();
const TutorPostController = require("../controllers/tutor_post.controller");
const { authAdminMiddleware, authMiddlewareOnlyToken } = require("../middleware/authMiddleware");
const multer = require('multer');
const upload = multer(); 

router.post('/create', authMiddlewareOnlyToken, upload.array('files'), TutorPostController.createPost);
router.get('/get-post/:id', TutorPostController.getPost);
router.get('/get-all-posts', TutorPostController.getAllPosts);
router.get('/get-posts-by-user/:userId', TutorPostController.getPostsByUser);
router.put('/update-post/:id', authMiddlewareOnlyToken, upload.any(), TutorPostController.updatePost);
router.delete('/delete-post/:id', authMiddlewareOnlyToken, TutorPostController.deletePost);
router.put('/update-status/:id', authAdminMiddleware, TutorPostController.updatePostStatus);

module.exports = router;
