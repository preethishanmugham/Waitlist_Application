import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../context/UserProvider";


import axios from "axios";

const Score = ({ socket }) => {
  const { user, score, setScore, token, referral, setReferral } = UserState();

  const navigate = useNavigate();

  useEffect(() => {
    //societ io things her get the live data based on something and update the state
    socket.on("updated-leaderboard", (leaderboard) => {
      console.log(leaderboard);
      let position=leaderboard.users;
      setScore(position);
      console.log(score);
    });
    getScore();
  }, []);

  //api request
  const getScore = async () => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
        withCredentials: true,
      },
    };

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/room/get`, config)
      .then((res) => {
        setScore(res.data.scores.users);
      })
      .catch((err) => {
        console.log("error", err.message);
      });
  };

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    console.log("copied", text);
  };
  return (
    
    <div className="flex flex-col items-center  justify-start h-[100vh] w-[100vw] gap-5 bg-yellow ">
      <p
        className="text-4xl mt-5 cursor-pointer "
        onClick={() => {
          navigate(-1);
        }}
      >
        <span>
          <i class="fa-solid fa-angle-left mr-3"></i>
        </span>
        Leaderboard
      </p>
      <div className="flex flex-col items-center justify-between w-[100%]  mt-5 max-w-lg h-[100%] ">
        {/* ranklist */}
        <div className="flex h-[65%] w-[90%] bg-white">
          <ul className="w-[100%] flex flex-col gap-2">
            {score.map((item) => {
              return (
                <li
                  key={item._id}
                  className={`${
                    item.user && item.user.email == user.email
                      ? "bg-yellow-300"
                      : "bg-orange-200"
                  }  w-[100%] px-5 py-2 rounded-lg flex justify-start gap-[10%]`}
                >
                  <span className="font-bold">
                    {" "}
                    #{item.position <= 0 ? 1 : item.position}{" "}
                  </span>
                  <span className="font-bold">
                    {" "}
                    {item.user ? item.user.name : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* referral link */}

        <div className="flex flex-col w-[90%]  h-[30%]   max-w-lg cursor-pointer ">
          <div className="flex   flex-col  items-center justify-center border-3 rounded-lg shadow-lg mb-4 bg-orange-600 p-5">
            {score.map((item) => {
              if (item.user && user && item.user.email == user.email)
                return (
                  <p
                    key={item._id}
                    className="text-lg font-bold text-orange-200 "
                    onClick={() => {
                      copy(item.user.referralCode);
                    }}
                  >
                    Your code{" "}
                    <span className="font-extrabold">
                      {item.user.referralCode}
                    </span>
                    <span>
                      <i class="fa-regular fa-clipboard mx-3"></i>
                    </span>
                  </p>
                );
            })}
          </div>
          {/* infstruction */}
          <div className="flex flex-col items-center justify-center">
            <ul>
              <li>offer on the iphone 15 for 1st position</li>
              <li>Earn 1 position forward on each referral </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
