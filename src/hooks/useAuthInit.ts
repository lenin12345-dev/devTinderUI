import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFailure } from "../utils/userSlice.js";
import axiosInstance from "../config/axiosConfig.js";

export default function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        dispatch(authStart());

        const { data } = await axiosInstance.get("/profile");

        if (mounted) dispatch(authSuccess(data.user));
      } catch (err) {
        if (mounted) dispatch(authFailure());
      }
    };

    checkAuth();
    return () => (mounted = false);
  }, []);
}
/*/ Overall Auth Flow
App start
   ↓
useAuthInit() runs
   ↓
GET /profile
   ↓
backend reads cookie
   ↓
if valid → dispatch(authSuccess(user))
if invalid → dispatch(authFailure())
   ↓
Redux state updated
   ↓
ProtectedRoute checks user
   ↓
Allow access OR redirect to /auth
/*/
/*/Login Flow
User enters email/password
        ↓
POST /login
        ↓
Backend sets cookie
Set-Cookie: token=abc123
        ↓
Browser stores cookie
        ↓
GET /profile
        ↓
Backend reads cookie
        ↓
Return user
        ↓
dispatch(authSuccess(user))
        ↓
navigate("/") 
/*/
