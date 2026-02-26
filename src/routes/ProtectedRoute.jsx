import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "../components/ui/FullPageLoader";

export default function ProtectedRoute() {
  const { user, loading } = useSelector((state) => state.user);
  console.log("ProtectedRoute - user:", user, "loading:", loading);

  if (loading) return <FullPageLoader />;

  if (!user && !loading) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
