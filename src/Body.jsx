import React, { useEffect } from "react";
import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "./utils/userSlice.jsx";

const Body = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        credentials: "include",
      });
      const data = await response.json();
      dispatch(loginRequest(data?.user));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
   if (!user) getUser();
  }, [user]);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Grow will push the footer to the bottom */}
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
