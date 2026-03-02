import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/userSlice";
import axiosInstance from "../config/axiosConfig";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`/logout`);
      dispatch(logout());
      navigate("/auth");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar bg-base-300 px-6 shadow-md">
      {/* Left */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-primary transition-colors"
        >
          Dev MeetUp
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden md:block font-medium whitespace-nowrap">
            Welcome, {user.firstName || "User"}
          </span>
        )}

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-base-content">
              <img
                alt="Profile"
                src={
                  user?.photoUrl || "https://via.placeholder.com/150?text=User"
                }
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {open && (
            <ul className="absolute right-0 mt-3 w-52 bg-base-100 shadow-lg rounded-xl p-2 z-50 space-y-1">
              <li>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-base-200"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-base-200"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-base-200"
                >
                  Requests
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded hover:bg-error hover:text-white transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
