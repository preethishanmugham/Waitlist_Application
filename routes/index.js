const router = require("express").Router();


const { sendEMail } = require("../controller/otpController");

const {protected} =require('../middleware/protected');


const OTP=require('../model/OTP');

// testing our api 
router.get("/", (req, res) => {
  res.status(200).json({ message: "api runnig" });
});

//testing  our api  (home page a protected route to verify the user)
router.get('/home'  , (req, res)=>{
  return res.status(200).json({message:"you are a authenticated user"});
})

// handles the user authentication login and signup 
router.use("/auth", require("./auth"));

// handle user details 
router.use('/user' , require('./user'));


//testing route for time to live mongoose schema



module.exports = router;
