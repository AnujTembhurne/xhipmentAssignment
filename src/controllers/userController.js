const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isValidRequestBody ,isValidEmail, isValidPassword}= require("../validators/validation")

//==========================create user ========================================

const createUser = async function(req,res){
    try{
        let data = req.body ;
        const { Name, email , phoneNumber,password, userName}  = data;

        if(!isValidRequestBody(data)) return res.status(400).send({status:false,message:" Please give some data"})

        if(!Name) return res.status(400).send({status:false,message:"Name is required"})

        if(!email) return res.status(400).send({status:false,message:"email is required"})
        if(!isValidEmail(email)) return res.status(400).send({status:false,message:"email is not valid"})
        let uniqueEmail = await userModel.findOne({email:email});
        if(uniqueEmail) return res.status(409).send({status:false,message:"email already exists"});

        let uniquePhoneNumber = await userModel.findOne({phoneNumber:phoneNumber});
        if(uniquePhoneNumber) return res.status(409).send({status:false,message:"phoneNumber already exists"});

        if(!password) return res.status(400).send({status:false,message:"password is required"})
        if(!isValidPassword(password)) return res.status(400).send({status:false,message:"password is not valid"})

        const salt = await bcrypt.genSalt(10)
        data.password = await bcrypt.hash(data.password, salt)

        if(!userName) return res.status(400).send({status:false,message:"userName is required"})
        let uniqueUserName = await userModel.findOne({userName:userName});
        if(uniqueUserName) return res.status(409).send({status:false,message:"username already exists"});

        const user = await userModel.create(data);
        return res.status(201).send({status:true,message:"profile created successfully",data:user})
    }
    catch(err){
        return res.status(500).send({status :false, message:err.message})
    }
}

//============================user login================================

const userLogin = async function (req,res){
    try{
        let data = req.body;
        if(!isValidRequestBody(data)) return res.status(400).send({status:false,message:" Please give some data"})

        const {email,password} = data;

        if(!email) return res.status(400).send({status:false,message:"email is required"})
        if(!password) return res.status(400).send({status:false,message:"password is required"})

        let emailCheck = await userModel.findOne({email:email});
        if(!emailCheck) return res.status(404).send({status:false,message:"user with this email is not registered"})

        let passwordCheck = await bcrypt.compare(password, emailCheck.password)
        if(!passwordCheck) return res.status(404).send({status: false, message: "Password provided is not valid"})

        let token = jwt.sign(
            {
                userId : emailCheck._id.toString()
            },
            "user is a main focus"
        );
        return res.status(200).send({status:true,message:"user login successful",data:{userId:emailCheck._id,token:token}});

    }
    catch(err){
        return res.status(500).send({status :false, message:err.message})
    }
}

module.exports = { createUser , userLogin};
 