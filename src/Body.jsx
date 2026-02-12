import React, { useEffect } from "react";
import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "./utils/userSlice.jsx";
import axiosInstance from "./config/axiosConfig.js";

const Body = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      const { data } = await axiosInstance.get("/profile");
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

      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
