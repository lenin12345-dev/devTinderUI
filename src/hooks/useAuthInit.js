import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authStart, authSuccess, authFailure } from "../utils/userSlice";
import axiosInstance from "../config/axiosConfig";

export default function useAuthInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      dispatch(authStart());
      try {
        const { data } = await axiosInstance.get("/profile");
        if (mounted) dispatch(authSuccess(data.user));
      } catch {
        if (mounted) dispatch(authFailure());
      }
    };

    checkAuth();
    return () => (mounted = false);
  }, [dispatch]);
}
