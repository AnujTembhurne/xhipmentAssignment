const userModel = require("../models/userModel");
const postModel = require("../models/postModel");
const upload = require("../aws/config");
const { isValidRequestBody } = require("../validators/validation");

//=================create a post ====================================

const createPost = async function (req, res) {
    try {
        let data = req.body;
        let userId = req.params.userId;

        let files = req.files;

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        if (files && files.length > 0) {
      
            let url = await upload.uploadFile(files[0]);
            data["image"]= url;

          } else {
            return res.status(400).send({ status: false, message: "image is a mandatory field" });
          }

        let newPost = await postModel.create(data);

        let count = user.postCount + 1
        let postData = user.postData

        let obj = {}
        obj["Image"] = newPost["image"]
        obj["Caption"] = newPost["caption"]
        obj["Likes"] = newPost["likesCount"]
        obj["Comments"] = newPost["commentsCount"]
        postData.push(obj)

        await userModel.findOneAndUpdate({ _id: userId }, { postData: postData, postCount: count })

        return res.status(201).send({ status: true, message: "post created successfully", data: obj })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//======================edit a post ========================================

const editPost = async function (req, res) {
    try {
        let userId = req.params.userId;
        let postId = req.params.postId
        let data = req.body;

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        const post = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!post) return res.status(404).send({ status: false, message: "post doesn't exist" });

        let newData = await postModel.findOneAndUpdate({ _id: postId }, data, { new: true })
        return res.status(200).send({ status: true, messsage: "post updated", data: newData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//===================delete a post==================

const deletePost = async function (req, res) {
    try {
        let userId = req.params.userId;
        let postId = req.params.postId;

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        const post = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!post) return res.status(404).send({ status: false, message: "post doesn't exist" });

        let newData = await postModel.findOneAndUpdate({ _id: postId }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, messsage: "post deleted" })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

//==========================get a post===============================

const getPost = async function (req, res) {
    try {
        let userId = req.params.userId;
        let postId = req.params.postId;

        const user = await userModel.findOne({ _id: userId });
        if (!user) return res.status(404).send({ status: false, message: "user doesn't exist" });

        const post = await postModel.findOne({ _id: postId, isDeleted: false });
        if (!post) return res.status(404).send({ status: false, message: "post doesn't exist" });

        let obj = {}
        obj["Image"] = post["image"]
        if (post.caption) {
            obj["Caption"] = post["caption"]
        }
        obj["Likes"] = post["likesCount"]
        obj["Comments"] = post["commentsCount"]
        return res.status(200).send({ status: true, data: obj })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createPost, editPost, deletePost, getPost }