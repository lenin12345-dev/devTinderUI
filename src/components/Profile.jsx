import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../config/api";

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

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      dispatch(loginRequest(data?.data));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center">
          <img
            src={editUser.photoUrl || "https://via.placeholder.com/150"}
            alt="User"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-sm mb-4"
          />
          <h2 className="text-xl font-semibold mb-4">Edit Your Profile</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col space-y-3"
        >
          {[
            { name: "firstName", label: "First Name", type: "text" },
            { name: "lastName", label: "Last Name", type: "text" },
            { name: "age", label: "Age", type: "number" },
            { name: "gender", label: "Gender", type: "text" },
            { name: "photoUrl", label: "Photo URL", type: "text" },
            { name: "skills", label: "Skills (comma separated)", type: "text" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col space-y-1">
              <label htmlFor={field.name} className="font-medium text-sm">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={editUser[field.name]}
                onChange={handleChange}
                placeholder={field.label}
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
