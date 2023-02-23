const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidRequestBody, isValidEmail, isValidPassword, isValidObjectId } = require("../validators/validation");

//==========================create user ========================================

const createUser = async function (req, res) {
    try {
        let data = req.body;
        const { Name, email, phoneNumber, password, userName } = data;

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: " Please give some data" })

        if (!Name) return res.status(400).send({ status: false, message: "Name is required" })

        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "email is not valid" })
        let uniqueEmail = await userModel.findOne({ email: email });
        if (uniqueEmail) return res.status(409).send({ status: false, message: "email already exists" });

        let uniquePhoneNumber = await userModel.findOne({ phoneNumber: phoneNumber });
        if (uniquePhoneNumber) return res.status(409).send({ status: false, message: "phoneNumber already exists" });

        if (!password) return res.status(400).send({ status: false, message: "password is required" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password is not valid" })

        const salt = await bcrypt.genSalt(10)
        data.password = await bcrypt.hash(data.password, salt)

        if (!userName) return res.status(400).send({ status: false, message: "userName is required" })
        let uniqueUserName = await userModel.findOne({ userName: userName });
        if (uniqueUserName) return res.status(409).send({ status: false, message: "username already exists" });

        const user = await userModel.create(data);
        return res.status(201).send({ status: true, message: "profile created successfully", data: user })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//============================user login================================

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: " Please give some data" })

        const { email, password } = data;

        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })

        let emailCheck = await userModel.findOne({ email: email });
        if (!emailCheck) return res.status(404).send({ status: false, message: "user with this email is not registered" })

        let passwordCheck = await bcrypt.compare(password, emailCheck.password)
        if (!passwordCheck) return res.status(404).send({ status: false, message: "Password provided is not valid" })

        let token = jwt.sign(
            {
                userId: emailCheck._id.toString()
            },
            "user is a main focus"
        );
        return res.status(200).send({ status: true, message: "user login successful", data: { userId: emailCheck._id, token: token } });

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//==================following a user===========================

const followUser = async function (req, res) {
    try {
        let userId = req.params.userId;
        let personToFollow = req.body.userId

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        if (!personToFollow) return res.status(400).send({ status: false, message: "Please give userId to follow person" });

        if (!isValidObjectId(personToFollow)) return res.status(400).send({ status: false, message: "please give valid id in the body" });

        if (userId == personToFollow) return res.status(400).send({ status: false, message: "you cannot follow yourself" });

        const bodyUser = await userModel.findOne({ _id: personToFollow });
        if (!bodyUser) return res.status(404).send({ status: false, message: "user you want to follow doesn't exist" });

        let updated = {}

        let followerList = bodyUser.followersList

        let newFollower = {}
        newFollower["_id"] = user["_id"]
        newFollower["userName"] = user["userName"]
        newFollower["Name"] = user["Name"]

        followerList.push(newFollower)
        updated["followersList"] = followerList

        updated["followersCount"] = bodyUser.followersCount + 1;

        let update1 = await userModel.findOneAndUpdate({ _id: personToFollow }, updated)

        let updated2 = {}

        let FollowingList = bodyUser.followingList
        let newFollowing = {}

        newFollowing["_id"] = bodyUser["_id"]
        newFollowing["userName"] = bodyUser["userName"]
        newFollowing["Name"] = bodyUser["Name"]

        FollowingList.push(newFollowing)

        updated2["followingList"] = FollowingList
        updated2["followingCount"] = user.followingCount + 1

        let update2 = await userModel.findOneAndUpdate({ _id: user }, updated2)

        return res.status(200).send({ status: true, message: `Now following ${bodyUser.userName}.` })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//======================unfollowing a user=========================

const unFollowUser = async function (req, res) {
    try {
        let userId = req.params.userId;
        let personToUnfollow = req.body.userId

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        if (!personToUnfollow) return res.status(400).send({ status: false, message: "Please give userId to unfollow person" });

        if (!isValidObjectId(personToUnfollow)) return res.status(400).send({ status: false, message: "please give valid id in the body" });

        if (userId == personToUnfollow) return res.status(400).send({ status: false, message: "you cannot unfollow yourself" });

        const bodyUser = await userModel.findOne({ _id: personToUnfollow });
        if (!bodyUser) return res.status(404).send({ status: false, message: "user you want to unfollow doesn't exist" });


        let followerList = bodyUser.followersList
        for (let i = 0; i < followerList.length; i++) {
            if (followerList[i].userName == user.userName) {
                followerList.splice(i, 1)
                let followerCount = bodyUser.followersCount - 1
                let updated = await userModel.findByIdAndUpdate({ _id: personToUnfollow }, { followersList: followerList, followersCount: followerCount })
                break;
            }
        }

        let FollowingList = user.followingList
        for (let i = 0; i < FollowingList.length; i++) {
            if (FollowingList[i].userName == bodyUser.userName) {
                FollowingList.splice(i, 1)
                let FollowingCount = user.followingCount - 1
                let updated2 = await userModel.findOneAndUpdate({ _id: user }, { followingList: FollowingList, followingCount: FollowingCount })
            }
        }

        return res.status(200).send({ status: true, message: `you have unfollowed ${bodyUser.userName}.` })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//====================get users follower and following details =========================

const userDetails = async function (req, res) {
    try {
        let userId = req.params.userId;

        const details = await userModel.findOne({ _id: userId }).select({ followersList: 1, followingList: 1, _id: 0 })
        return res.status(200).send({ status: true, message: "user details", data: details })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//===================Comment on the post======================================

const commentOnPost = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { postId, comment } = data

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, message: " Please give some data" })

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        if (!postId) return res.status(400).send({ status: false, message: "Please provide postId " })
        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "please give valid id in the body" });
        const postCheck = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!postCheck) return res.status(404).send({ status: false, message: "post doesn't exist" });

        if (!comment) return res.status(400).send({ status: false, message: "Please provide comment " })

        let CommentsCount = postCheck.commentsCount + 1
        let CommentsList = postCheck.commentsList

        let obj = {}
        obj["userName"] = user.userName
        obj["Comment"] = comment
        CommentsList.push(obj)

        let updating = await postModel.findOneAndUpdate({ _id: postId }, { commentsCount: CommentsCount, commentsList: CommentsList }, { new: true })
        return res.status(200).send({ status: true, message: "Commented on the post", data: updating })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//==============================Like a post==================================

const likePost = async function (req, res) {
    try {
        let userId = req.params.userId;
        let postId = req.body.postId;

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        if (!postId) return res.status(400).send({ status: false, message: "Please provide postId " })
        if (!isValidObjectId(postId)) return res.status(400).send({ status: false, message: "please give valid id in the body" });
        const postCheck = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!postCheck) return res.status(404).send({ status: false, message: "post doesn't exist" });

        let likesList = postCheck.likesList

        let newLike = {}
        newLike.userName = user.userName
        likesList.push(newLike)
        let likesCount = postCheck.likesCount + 1

        let updateLikeList = await postModel.findOneAndUpdate({ _id: postId }, { likesList: likesList, likesCount: likesCount }, { new: true });
        return res.status(200).send({ status: true, message: " liked a post ", data: updateLikeList })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createUser, userLogin, followUser, unFollowUser, userDetails, commentOnPost, likePost };
