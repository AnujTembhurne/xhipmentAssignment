const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("../validators/validation");

//=========================Authentication==============================

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, "user is a main focus", (err, decodedToken) => {
            if (err) {
                let message = err.message === "jwt expired" ? "token is expired" : "token is invalid";
                return res.status(401).send({ status: false, message: message });
            }
            req.headers = decodedToken
            next();
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

//=======================Authorization===============================

const isUserAuthorised = async (req, res, next) => {
    let userId = req.params.userId;

    if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid UserId" });

    let loginUserId = req.headers.userId;
    if (loginUserId !== userId) {
        return res.status(403).send({ status: false, message: "You are not authorised" });
    }
    next();
};

module.exports = { authentication, isUserAuthorised };