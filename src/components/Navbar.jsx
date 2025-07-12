import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../utils/userSlice';

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      dispatch(loginRequest(null));
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-md">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold hover:text-primary transition-colors">
          Dev Tinder
        </Link>
      </div>

      <div className="flex-none gap-4 items-center">
        {user && (
          <span className="hidden md:inline text-md font-medium">
            Welcome, {user.firstName || "User"}!
          </span>
        )}

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-base-content">
              <img
                alt="Profile"
                src={
                  user?.photoUrl ||
                  "https://via.placeholder.com/150?text=User"
                }
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                to="/profile"
                className="hover:bg-base-200 transition-colors rounded"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/connections"
                className="hover:bg-base-200 transition-colors rounded"
              >
                Connections
              </Link>
            </li>
            <li>
              <Link
                to="/requests"
                className="hover:bg-base-200 transition-colors rounded"
              >
                Requests
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left hover:bg-error hover:text-white transition-colors rounded px-2 py-1"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
