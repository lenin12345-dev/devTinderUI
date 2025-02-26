import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginRequest } from "../utils/userSlice";

const Login = () => {
  const [loginObj, setLoginObj] = useState({ emailId: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setLoginObj({ ...loginObj, [event.target.name]: event.target.value });
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginObj),

        credentials:"include",
      });
      const data = await response.json();
      console.log('data',data);
      
      dispatch(loginRequest(data?.data));
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center m-4 mt-8">
      <div className="card bg-base-300 w-96  shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <label className="form-control w-full max-w-xs my-2">
            <div className="label"></div>
            <input
              type="text"
              name="emailId"
              placeholder="Email"
              value={loginObj.emailId}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs my-2">
            <input
              type="text"
              placeholder="Password"
              name="password"
              value={loginObj.password}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <div className="card-actions justify-center">
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
