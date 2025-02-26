import React, { useState, useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [editUser, setEditUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    photoUrl: user?.photoUrl || "",
    skills: user?.skills || "",
  });
  const dispatch = useDispatch()

  useEffect(() => {
    setEditUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      age: user?.age || "",
      gender: user?.gender || "",
      photoUrl: user?.photoUrl || "",
      skills: user?.skills || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/profile/edit", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
        credentials: "include",
      });
      const data = await res.json();
      dispatch(loginRequest(data?.data))

    } catch (error) {

    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img src={user?.photoUrl} alt="Shoes" />
        </figure>
        <div className="card-body">
          <label className="form-control w-full max-w-xs my-2">
            <div className="label"></div>
            <input
              type="text"
              name="firstName"
              placeholder="firstName"
              value={editUser?.firstName}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <input
              type="text"
              placeholder="lastName"
              name="lastName"
              value={editUser?.lastName}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <input
              type="text"
              placeholder="age"
              name="age"
              value={editUser?.age}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <input
              type="text"
              placeholder="photoUrl"
              name="photoUrl"
              value={editUser?.photoUrl}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <input
              type="text"
              placeholder="skills"
              name="skills"
              value={editUser?.skills}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <div className="card-actions justify-center">
            <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
