const express = require("express");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const MW = require("../middlewares/auth")
const router = express.Router();

//==================== user routes ======================================

router.post("/user/register", userController.createUser);
router.post("/user/login", userController.userLogin);;
router.put("/user/:userId/follow", MW.authentication, MW.isUserAuthorised, userController.followUser);
router.put("/user/:userId/unfollow", MW.authentication, MW.isUserAuthorised, userController.unFollowUser);
router.get("/user/:userId", MW.authentication, MW.isUserAuthorised, userController.userDetails);
router.put("/user/:userId/like", MW.authentication, MW.isUserAuthorised, userController.likePost);
router.put("/user/:userId/comment", MW.authentication, MW.isUserAuthorised, userController.commentOnPost);

//===================== Post routes ===================================

router.post("/post/:userId/create", MW.authentication, MW.isUserAuthorised, postController.createPost);
router.put("/post/:userId/updatePost/:postId", MW.authentication, MW.isUserAuthorised, postController.editPost);
router.delete("/post/:userId/deletePost/:postId", MW.authentication, MW.isUserAuthorised, postController.deletePost);
router.get("/post/:userId/getPost/:postId", MW.authentication, MW.isUserAuthorised, postController.getPost);

//===================== Invalid API =================================

router.all("/**", function (req, res) {
    res.status(404).send({ status: false, message: "please provide valid url" })
});

module.exports = router;
