const mongoose = require("mongoose");

// to store the ranks list and update the leader board realtime
// we need a room either a array or a docuemtns with score list

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "LeaderBoard",
    },

    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          require: true,
        },
        position: {
          type: Number,
          default: 100,
        },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
