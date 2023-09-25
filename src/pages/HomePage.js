import React, { useEffect } from "react";
import iphone from "../utils/iphone.png";
import axios from "axios";
import { UserState } from "../context/UserProvider";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../utils/background.png";

const HomePage = () => {
  const { token, setUser, user } = UserState();

  const navigate = useNavigate();

  const getInfo = async (token) => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
        withCredentials: true,
      },
    };
    // console.log(process.env.REACT_APP_BASE_URL);

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/get-info`, config)
      .then((response) => {
        const { user } = response.data;
        setUser(user);
      })
      .catch((err) => {
        localStorage.removeItem("signedJWT");

        console.log("invalid jwt user not authenticated");
        // console.log(err);
        navigate("/");
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getInfo(token);
    }, 100);
    return () => clearTimeout(timer);
  }, [token]);

  //global variable

  return (
    <div className="bg-yellow-100/100  h-[100vh] w-[100vw] flex items-center justify-center sm:p-5 md:p-10"style={{ backgroundImage: `url(${backgroundImage})` , backgroundSize: 'cover' }}>
    <div className="h-[100vh] w-[100vw] bg-yellow overflow-x-hidden relative  flex flex-col">
      {/* original downs */}
      {/* <div className="h-[100%] w-[100%] bg-white overflow-x-hidden relative  flex flex-col"> */}


      <img
          src={iphone}
          className="object-contain  w-[60%] h-[70%] sm:w-[100%] sm:h-[-100%]    absolute top-[15%] left-[-1000%] sm:left-[-900%] md:left-[-10%]  "
        />


    </div>
      <div className=" mt-[-10%]  w-[100%] flex-1 flex justify-center items-center">
        {user && (
          <div className="mt-[10%]   md:mt-[7%] sm:mx-[10%] ">
            {/* not registerd for the iphone  */}
            {!user.joinedRoom && (
              <p className=" text-2xl cursor-pointer sm:text-2xl md:text-4xl bg-clip-text   text-transparent bg-gradient-to-r  from-orange-500 to-yellow-500">
             <Link to={"/early-register"}> Register</Link>
             <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </p>
            )}
            {/* user register for iphone */}
            {user.joinedRoom && (
            <div className="flex justify-center items-center h-screen">
  
    <p className="text-2xl cursor-pointer sm:text-2xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
      <Link to={"/leader-board"}>Leaderboard</Link>
      <i className="fa-solid fa-chevron-right"></i>
    </p>
    </div>
  )}



            {/* user registerd for the iphone and got postin 1 in the leaderboard */}
            {user.winner && (
              <p className=" text-2xl cursor-pointer sm:text-2xl md:text-4xl bg-clip-text   text-transparent bg-gradient-to-r  from-indigo-800 via-purple-700 to-pink-600  ">
                <Link to={"/reedem-coupons"}> Coupons</Link>
                <i class="fa-solid fa-chevron-right"></i>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
