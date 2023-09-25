const {joinRoom  , getScores} =require('../controller/roomController');
const {protected} =require('../middleware/protected');
const router = require("express").Router();


// its a proteted route , to allow only the verified user to regiseter for the ipohne
router.post('/join' , protected, joinRoom);

//societ io based reatime socre updating route only for verified user
router.get('/get' , protected, getScores);



module.exports = router;
