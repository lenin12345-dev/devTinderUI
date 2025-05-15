import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    photoUrl: "",
    skills: "",
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (user) {
      setEditUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        gender: user.gender || "",
        photoUrl: user.photoUrl || "",
        skills: user.skills || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
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

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      dispatch(loginRequest(data?.data));
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast(error.message || "Failed to update", "error");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img src={editUser.photoUrl || "https://via.placeholder.com/150"} alt="User" />
        </figure>
        <div className="card-body">
          {["firstName", "lastName", "age", "gender", "photoUrl", "skills"].map((field) => (
            <label key={field} className="form-control w-full max-w-xs my-2">
              <input
                type="text"
                placeholder={field}
                name={field}
                value={editUser[field]}
                onChange={handleChange}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          ))}
          <div className="card-actions justify-center">
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Toast */}
      {toast.show && (
        <div className="toast toast-bottom toast-center z-50">
          <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
