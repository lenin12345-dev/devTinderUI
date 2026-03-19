// src/layouts/Body.jsx
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Body = () => {
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
