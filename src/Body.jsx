// src/layouts/Body.jsx
import Navbar from "../src/components/Navbar.jsx";
import Footer from "../src/components/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuthInit from "../src/hooks/useAuthInit.js";

const Body = () => {
  useAuthInit();

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
