import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../utils/userSlice';


const Navbar = () => {
  const {user} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch()


const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include", // Ensures cookies are sent
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    // Redirect to login page
    dispatch(loginRequest(null))
    localStorage.removeItem("user")
    navigate("/login");
  } catch (err) {
    console.error("Logout Error:", err);
  }
};

  
  return (
    <div className="navbar bg-base-300">
    <div className="flex-1">
    <Link to={"/"}  className="justify-between">
     Dev Tinder
      </Link >
    </div>
    <div className="flex-none gap-2">
    {user && <span className="text-lg font-semibold">Welcome, {user.firstName}!</span>}  
      <div className="dropdown dropdown-end mx-5">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-11 h-11 rounded-full overflow-hidden">
            <img
              alt="Tailwind CSS Navbar component"
              className='w-full h-full object-cover'
              src={user?.photoUrl} />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li>
            <Link to={"/profile"}  className="justify-between">
              Profile
            </Link >
          </li>
          <li>      <Link to={"/connections"}  className="justify-between">
              Connections
            </Link ></li>
            <li>      <Link to={"/requests"}  className="justify-between">
              Requests
            </Link ></li>
        <button className='flex justify-start ml-3' onClick={handleLogout}>Logout</button>
        </ul>
      </div>
    </div>
  </div>
  )
}

export default Navbar