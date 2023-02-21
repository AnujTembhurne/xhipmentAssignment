const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Name : {
        type:String,
        required : true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber :{
        type:Number,
        unique:true
    },
    password :{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});

module.exports = mongoose.model("user", userSchema);
