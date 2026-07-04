import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateAdminRoute = () => {
  const { admin } = useSelector((state) => state.admin);

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateAdminRoute;