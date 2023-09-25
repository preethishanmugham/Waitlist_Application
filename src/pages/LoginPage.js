import React from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useState } from "react";
import loginBg from "../utils/LoginPage.png";
import backgroundImage from "../utils/background.png";

const LoginPage = () => {
  const [login, setLogin] = useState(true);
  const handleLogin = () => {
    setLogin(!login);
  };
  return (
    <>
<div className="bg-yellow-100/100  h-[100vh] w-[100vw] flex items-center justify-center sm:p-5 md:p-10"style={{ backgroundImage: `url(${backgroundImage})` , backgroundSize: 'cover' }}>
      
        <div className=" p-5 sm:p-6 md:p-2 shadow-lg flex items-center  gap-0 justify-center h-[90%]  w-[100%]  max-w-5xl  rounded-lg ">
          <div className="bg-yellow  relative  w-[100%] md:w-1/2  h-full  items-center justify-center ">
            <img
              className="object-cover h-[100%]  w-[100%] rounded-[100%] "
              src={loginBg}
            />
          </div>
          <div className=" w-[100%] md:w-[50%]  rounded-xl  bg-yellow h-full flex items-center justify-center">
            {login ? (
              <Login handleLogin={handleLogin} />
            ) : (
              <Register handleLogin={handleLogin} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;