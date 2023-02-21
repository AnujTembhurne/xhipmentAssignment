const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

//====================user routes ======================================

router.post("/user",userController.createUser);
router.post("/login",userController.userLogin)

module.exports = router;
