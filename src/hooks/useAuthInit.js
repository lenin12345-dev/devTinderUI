import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFailure } from "../utils/userSlice";
import axiosInstance from "../config/axiosConfig";

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
