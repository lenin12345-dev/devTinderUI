// src/layouts/Body.jsx
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Body = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

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
