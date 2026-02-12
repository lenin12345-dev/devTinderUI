import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosConfig";

const Login = () => {
  const [loginObj, setLoginObj] = useState({ emailId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setLoginObj({ ...loginObj, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    const { emailId, password } = loginObj;

    if (!emailId || !password) {
      toast.error("Please enter both email and password.");
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/login`, loginObj);

      dispatch(loginRequest(data.data));
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="card bg-base-300 w-96 shadow-xl p-4">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Login</h2>

          <label className="form-control w-full mb-3">
            <input
              type="email"
              name="emailId"
              placeholder="Email"
              value={loginObj.emailId}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control w-full mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginObj.password}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>

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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
