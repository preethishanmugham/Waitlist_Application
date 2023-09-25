import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "../context/UserProvider";
import Otp from "../components/Otp";
import Referral from "../components/Referral";




const JoinRoom = ({socket}) => {
  const { user } = UserState();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-gap gap-10  h-[100%] w-[100%]   bg-slate-100">
      <p
        onClick={() => {
          navigate(-1);
        }}
        className="text-4xl mt-14  cursor-pointer"
      >
        <span>
          <i class="fa-solid fa-angle-left"></i>
        </span>
        Home
      </p>

      {user&& user.verified ? <Referral  socket={socket} /> : <Otp />}
    </div>
  );
};

export default JoinRoom;
