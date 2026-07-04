import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateAdminRoute = () => {
  const { admin, loading } = useSelector((state) => state.admin);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateAdminRoute;