import React, { useEffect, useRef } from "react";
import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footer.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "./utils/userSlice.jsx";
import axiosInstance from "./config/axiosConfig.js";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const fetchAttempted = useRef(false); // Prevent multiple requests

  const getUser = async () => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    try {
      const { data } = await axiosInstance.get("/profile");
      dispatch(loginRequest(data?.user));
    } catch (error) {
      console.error("Profile fetch error:", error);
      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        console.log("User not authenticated, redirecting to login");
        navigate("/auth");
      }
    }
  };
  useEffect(() => {
    if (!user && !fetchAttempted.current) {
      getUser();
    }
  }, []);
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
