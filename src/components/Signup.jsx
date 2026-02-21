import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { authSuccess } from "../utils/userSlice";
import axiosInstance from "../config/axiosConfig";

const SignUp = () => {
  const [signupObj, setSignupObj] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setSignupObj({ ...signupObj, [event.target.name]: event.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    const { firstName, lastName, emailId, password } = signupObj;
    if (!firstName || !lastName || !emailId || !password) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/signup`, signupObj);
      const { data } = await axiosInstance.get("/profile");
      dispatch(authSuccess(data.user));
      navigate("/profile");

      toast.success("Signup successful!");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="card bg-base-300 w-96 shadow-xl p-4">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Sign Up</h2>

          {[
            { name: "firstName", placeholder: "First Name", type: "text" },
            { name: "lastName", placeholder: "Last Name", type: "text" },
            { name: "emailId", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field) => (
            <label key={field.name} className="form-control w-full mb-3">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={signupObj[field.name]}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </label>
          ))}

          {errorMsg && (
            <div className="text-red-500 text-sm text-center mb-2">
              {errorMsg}
            </div>
          )}

          <div className="card-actions justify-center mt-4">
            <button
              onClick={handleSubmit}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
