const router = require("express").Router();

const {protected} =require('../middleware/protected');

const {userInfo  } =require('../controller/userController');
const { sendEMail , createOtp , verifyOtp ,  } = require("../controller/otpController");


// routes to room file
router.use('/room' , require('./room'));

//sends the user info after verificatoin 
router.get("/get-info" , protected ,  userInfo);

// to generate otp and send otp via email 
router.get("/get-otp" , protected ,  createOtp ,sendEMail);

// to verifiy the user enter opt;
router.post('/verify-otp' , protected , verifyOtp );



module.exports = router;
