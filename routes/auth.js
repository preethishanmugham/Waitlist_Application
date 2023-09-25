
//controller
const { login, register } = require("../controller/authController");


const router = require("express").Router();

//for login 
router.post("/login",  login);

//for sigup 
router.post("/register", register);

module.exports = router;
