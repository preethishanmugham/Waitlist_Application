const mongoose = require("mongoose");

//user with list of check list check list
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    joinedRoom: {
      type: Boolean,
      default: false,
    },
    winner: {
      type: Boolean,
      default: false,
    },
    referralCode:{
      type:String, 
      default: ""
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
