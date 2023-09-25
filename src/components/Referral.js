import React, { useState, useEffect } from "react";
import axios from "axios";
import referralImg from "../utils/download.png";
import { UserState } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";

const Referral = ({socket}) => {
  const [referral, setReferral] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, setUser, user } = UserState();


  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSubmission = async (e) => {
    e.preventDefault();
    if(loading){
      return
    }
    setLoading(true);

    let config = {
      headers: {
        Authorization: "Bearer " + token,
        withCredentials: true,
      },
    };

    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/user/room/join`,
        { referral: referral },
        config
      )
      .then((res) => {
        if (res.status == 200) {
          setUser(res.user);

          console.log(res.data);
          
          socket.emit('update-leaderboard' , "send me the updated leaderboard");
          navigate(-2);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleReferral = (e) => {
    setReferral(e.target.value);
  };

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };

  //changes happens heree
  return (
    <div className="w-[100%] sm:w-[90%] max-w-md flex-1 sm:h-[80%] pb-4 mb-16 sm:mb-5 sm:rounded-lg sm:shadow-lg  flex flex-col justify-start items-center">
      <img className="h-[30%] ml-10 mt-10 " src={referralImg}></img>
      <div className="w-[90%] flex-1 flex flex-col items-center p-5 sm:p-2 gap-3 ">
        <form
          onSubmit={(e) => handleSubmission(e)}
          className="flex flex-col  h-[100%] justify-start gap-5 items-center  mt-10"
        >
          <label>Do you have a referral code ?</label>
          <input
            placeholder="Enter a referral code"
            className="w-[100%] login-input"
            value={referral}
            onChange={(e) => handleReferral(e)}
          />
          <div className="flex items-center gap-2 mt-2 w-[100%]">
            <div className="w-[45%] h-[0.5px]  bg-yellow-500/50 "></div>
            <p>OR</p>
            <div className="w-[45%] h-[0.5px]  bg-yellow-500/50 "></div>
          </div>

          <p>Continue without referral code</p>

          <button
            type="submit"
            className="w-[100%]  bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-400 text-white text-lg px-5 py-1 rounded-lg"
          >
            register soon!!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Referral;
