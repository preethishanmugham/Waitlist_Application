import { useEffect, createContext, useContext, useState } from "react";
import { json, useNavigate } from "react-router-dom";



const userContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [score, setScore] = useState([]);
  const { referral, setReferral } = useState("REFERRAL");

  const navigate = useNavigate();


  useEffect(() => {
    let userInfo = localStorage.getItem("signedJWT");
    userInfo = JSON.parse(userInfo);
    setToken(userInfo);

    if (!token) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, []);

  return (
    <userContext.Provider
      value={{ token, setToken, user, setUser, score, setScore , referral ,setReferral }}
    >
      {children}
    </userContext.Provider>
  );
};



export const UserState = () => {
  return useContext(userContext);
};


export default UserProvider;
