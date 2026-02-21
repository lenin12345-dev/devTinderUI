import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import FullPageLoader from "../components/ui/FullPageLoader";

export default function ProtectedRoute() {
  const { user, loading } = useSelector((state) => state.user);
  if (loading) return <FullPageLoader />;
  if (!loading && user === null) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
