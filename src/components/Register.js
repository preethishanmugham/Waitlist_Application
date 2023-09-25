import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const Register = ({ handleLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loding, setLoding] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("please fill all fields");
      return;
    }
    if (password != confirmPassword) {
      return toast.error("confirm password incorrect");
    }
    setLoding(true);
    const user = { name, email, password };

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        user,
      })
      .then((response) => {
        if (response.status !== 200) {
          console.log(response.data.message);
          toast(response.data.message);
        } else {
          console.log(response.data);
          toast.success("Registered");
          handleLogin();
        }
      });
  };
  const handleInput = (e, changeState) => {
    changeState(e.target.value);
  };

  return (
    <div className=" h-[110%]  w-[80%] md:w-[70%] rounded-xl flex flex-col  gap-2">
      <h3 className="text-3xl">Create an account</h3>
      <p className="text-orange-500 text-sm">
        Enter valid information!!
      </p>
      <form
        className="flex flex-col gap-2 mt-5"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label>Name</label>
        <input
          placeholder="Name"
          className="login-input"
          type="text"
          value={name}
          onChange={(e) => handleInput(e, setName)}
        />
        <label>Email</label>
        <input
          placeholder="Email"
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => handleInput(e, setEmail)}
        />
        <label>Password</label>
        <input
          placeholder="Password"
          className="login-input "
          type="password"
          value={password}
          onChange={(e) => handleInput(e, setPassword)}
        />
        <label>Confirm password</label>
        <input
          placeholder="Confirm password"
          className="login-input"
          value={confirmPassword}
          type="password"
          onChange={(e) => handleInput(e, setConfirmPassword)}
        ></input>

        <button className="login-btn mt-5">Register</button>

        <p className="text-yellow-500 text-sm m-auto mt-5">
          Have an account?{" "}
          <span>
            {" "}
            <button
              onClick={handleLogin}
              type="submit"
              className="text-md underline text-orange-500"
            >
              Login
            </button>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
