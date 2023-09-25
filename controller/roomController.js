const { emailConfig } = require("../config/nodemailer");
const Room = require("../model/Room");
const User = require("../model/User");
const nodemailer = require("nodemailer");

require("dotenv").config();

// register the user for the iphon 14
const joinRoom = async (req, res) => {
  try {
    // protected route gets user from the middleware
    const user = req.user;

    //getting the referral code send by user
    const { referral } = req.body;

    console.log("checking referral code");

    if (referral.length > 0) {
      await verifyCode(referral);
    }

    let randomeCode = generateReferral(6);
    //

    let updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { joinedRoom: true, referralCode: randomeCode },
      { new: true }
    );

    let isRoom = await Room.findOne({ name: "LeaderBoard" }).populate({
      path: "users",
      model: "User",
    });

    let postion = 99;
    let updatedRoom = {};

    if (isRoom) {
      postion += isRoom.users.length + 1;

      updatedRoom = await Room.findOneAndUpdate(
        { name: "LeaderBoard" },
        { $push: { users: { user, postion: postion + 1 } } },
        { new: true }
      );
    } else {
      await Room.create({ name: "LeaderBoard", students: [] });

      updatedRoom = await Room.findOneAndUpdate(
        { name: "LeaderBoard" },
        { $push: { users: { user, postion: postion + 1 } } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "joined the room ",
      room: updatedRoom,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error });
  }
};

//get the udpated leaderboard

const getScores = async (req, res) => {
  try {
    let scores = await Room.findOne({ name: "LeaderBoard" }).populate({
      path: "users",populate:{path: "user" , model: "User"}
    });
    console.log("sending the leaderboard");
    return res.status(200).json({ scores: scores });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: err });
  }
};

//to generate random referral code for new user
const generateReferral = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWZYZ0123456789";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

//checks refereal code ->calls updateLEaderBoard -> sends email
const verifyCode = async (code) => {
  try {
    let leaderBorardCollection = await Room.findOne({
      name: "LeaderBoard",
    }).populate({
      path: "users",
      populate: {
        path: "user",
        model: "User",
      },
    });
    let leaderboard = leaderBorardCollection.users;

    leaderboard.map(async (item, index) => {
      if (item.user.referralCode == code) {
        let start = index - 10;
        let end = index - 1;
        let insertItem = item;
        let insertIndex = index;
        let currentPostion = item.position;

        //give the user 10 points and change the leaderboard;
        let updatedLeaderBoard = await updateLeaderBoardHandler(
          start,
          end,
          leaderboard,
          insertItem,
          insertIndex,
          currentPostion
        );
        if (!updatedLeaderBoard) {
          console.log("error in updating laeaderboard");
          return;
        }

        //save the updated one to the batabase;

        let newLeaderBoard = await Room.updateOne(
          { name: "LeaderBoard" },
          { users: updatedLeaderBoard },
          { new: true }
        );

        console.log("referred user got 10 pointes");

        if (item.position <= 1) {
          //send email to the user
          await emailHandler(item.user.email, item.user.name);
        }
      }
    });
  } catch (error) {
    console.log("Error in rewards", error);
    return error;
  }
};

//updates the leader board changes the postition and give reward to referred user
const updateLeaderBoardHandler = async (
  start,
  end,
  leaderboard,
  insertItem,
  insertIndex,
  currentPostion
) => {
  try {
    if (start >= 0) {
      leaderboard.map((item, index) => {
        if (index >= start && index <= end) {
          item.position += 1;
        }
      });
    }
    insertItem.position -= 1;

    leaderboard[insertIndex] = insertItem;

    function compare(a, b) {
      const compareA = a.position;
      const compareB = b.position;
      let compare = 0;
      if (compareA > compareB) {
        compare = 1;
      } else if (compareA < compareB) {
        compare = -1;
      }
      return compare;
    }

    leaderboard = leaderboard.sort(compare);
    console.log(" leaderboad updated");
    return leaderboard;
  } catch (error) {
    console.log(error);
    return error;
  }
};
//sends email to the referered user
const emailHandler = async (to, name) => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: to, // list of receivers
      subject: " 25percent offer", // Subject line
      html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Early registration iPhone 14</a>
      </div>
      <p style="font-size:1.1em">Hi, ${name}</p>
      <p></p>
      <p style="font-size:0.9em;">Regards,<br />Congratulations, you've won an iPhone 14</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Realtime Waiting list</p>
        <p>Preethi Shanmugham</p>
        <a href="https://github.com/preethishanmugham/">gitHub profile</a>
      </div>
    </div>
  </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("email sent to winner", info);
  } catch (error) {
    console.log(error);
    return error;
  }
};
module.exports = { joinRoom, getScores };
