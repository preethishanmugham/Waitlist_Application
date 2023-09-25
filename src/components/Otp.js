import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "../context/UserProvider";
import otpImg from "../utils/oottpp.png";
import axios from "axios";
import CountDown from "./CountDown";
import { toast } from "react-toastify";
const Otp = () => {
  const { token, setUser, user } = UserState();

  const validateOTPbutton = useRef();

  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [userOTP, setUSerOTP] = useState("");
  const [checkOTP, setCheckOTP] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleVerification = async (e) => {
    setVerifying(true);
    if(e){
      e.preventDefault();
    }
    console.log("Sending opt");

    let config = {
      headers: {
        Authorization: "Bearer " + token,
        withCredentials: true,
      },
    };



    await axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/get-otp`, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        setVerifying(false);
        setUSerOTP("");
        setCheckOTP(false);
      });
  };

  const handleBeforeUnload = (e) => {
    e.preventDefault();
    const message =
      "Are you sure you want to leave? All provided data will be lost.";
    e.returnValue = message;
    return message;
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setCheckOTP(!checkOTP);
    validateOTPbutton.current.innerText = "VERIFYING OTP";
    if (userOTP) {
      console.log("verifyingOtp", userOTP);

      let config = {
        headers: {
          Authorization: "Bearer " + token,
          withCredentials: true,
        },
      };

      await axios
        .post(`${process.env.REACT_APP_BASE_URL}/user/verify-otp` ,{ otp: userOTP },  config, )
        .then((res) => {
          console.log(res.data);
          if(res.data && res.data.user){
            let updatedUser=res.data.user;
            toast.success("Email verified")
            console.log(updatedUser);
            setUser(updatedUser);
          }
        })
        .catch((err) => {
          console.log(err);
          setVerifying(false);
          setUSerOTP("");
          setCheckOTP(false);
    validateOTPbutton.current.innerText = "INVALID";
    navigate(-1);
        });
    }
  };

  return (
    <div className="w-[100%] sm:w-[90%] max-w-md flex-1 sm:h-[80%] pb-4 mb-16 sm:mb-5 sm:rounded-lg sm:shadow-lg  flex flex-col justify-start items-center">
      <img
        className="h-[30%] px-5 ml-[20%] sm:ml[17%] mt-10 sm:mt-5"
        src={otpImg}
      ></img>
      <div className="w-[90%] flex-1 flex flex-col items-center p-5 sm:p-2 gap-3 ">
        <p className="text-2xl font-thin">Verification</p>
        <p className="font-thin">
          You will get an to <span className="font-bold underline"> OTP</span>{" "}
          via email
        </p>

        {verifying ? (
          <CountDown
            resendOTP={handleVerification}
            setVerifying={setVerifying}
            verifying={verifying}
          />
        ) : (
          <p className="font-thin">
            Expires in : <span className="font-bold ">00:10</span>
          </p>
        )}

        <form className="flex flex-col  h-[100%] justify-start gap-5 items-center  mt-10">
          <input
            disabled={!verifying || checkOTP}
            placeholder="Enter opt"
            type="password"
            className="w-[100%] login-input placeholder:text-slate-800 disabled:bg-slate-100 disabled:border-slate-200 disabled:placeholder:text-slate-300"
            onChange={(e) => setUSerOTP(e.target.value)}
          />
          <button
            disabled={checkOTP || (!userOTP.length > 3 && verifying)}
            ref={validateOTPbutton}
            onClick={(e) => {
              {
                verifying ? verifyOTP(e) : handleVerification(e);
              }
            }}
            className="w-[100%]   bg-yellow-400 hover:bg-orange-400 active:bg-yellow-200 disabled:bg-yellow-200 text-white text-lg px-5 py-1 rounded-lg"
          >
            {verifying ? "VALIDATE" : "GET OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
