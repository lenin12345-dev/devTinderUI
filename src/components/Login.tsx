import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authSuccess } from "../utils/userSlice.js";
import toast from "react-hot-toast";
import axiosInstance from "../config/axiosConfig.js";
import type { RootState, AppDispatch } from "../utils/store";

interface LoginObj {
  emailId: string;
  password: string;
}
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
const Login = () => {
  const [loginObj, setLoginObj] = useState<LoginObj>({
    emailId: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      await axiosInstance.post(`/login`, loginObj);
      const { data } = await axiosInstance.get<{ user: User }>("/profile");
      dispatch(authSuccess(data.user));
      navigate("/");

      toast.success("Login successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

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
/*/ When user logs in:

POST /login
→ backend sends Set-Cookie: token=abc123
→ browser saves cookie



So React cannot truly know if login worked yet.

The only reliable check is:

GET /profile
→ browser automatically attaches cookie
→ backend reads cookie
→ returns user
/*/
