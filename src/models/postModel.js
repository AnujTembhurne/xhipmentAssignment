const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likesList: {
        type: Array,
        default: []
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    commentsList: {
        type: Array,
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model("post", postSchema);