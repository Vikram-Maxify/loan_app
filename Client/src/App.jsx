import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./Pages/Homepage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import OwnPocketOtpVerify from "./Pages/OtpVerify";
import OwnPocketHome from "./Pages/LoanHome";
import OwnPocketApplicationForm from "./Pages/ApplicationForm";
import OwnPocketCibilCheck from "./Pages/CibilCheck";
import OwnPocketApproved from "./Pages/ApprovedPage";
import OwnPocketReviewSubmit from "./Pages/LoanReview";
import OwnPocketBankDetails from "./Pages/BankDetails";
import OwnPocketProcessingFee from "./Pages/ProcessingFee";
import PaymentCheckout from "./Pages/PaymentPage";

import AdminLayout from "./Admin/AdminCOmponent/AdminLayout";
import UsersPage from "./Admin/AdminPage/UserPage";

import PrivateAdminRoute from "./Components/PrivateAdminRoute";
import { getAdminProfile } from "./redux/slice/adminSlice";
import AdminLogin from "./Admin/AdminPage/AdminLogin";
import AdminProfile from "./Admin/AdminPage/AdminProfile";
import AdminApplication from "./Admin/AdminPage/AdminApplication";
import AdminDashboard from "./Admin/AdminPage/Dashboard";
import AdminUpi from "./Admin/AdminPage/AdminUPI";
import AdminAmountSetting from "./Admin/AdminPage/AdminAmountSetting";
import AdminOrders from "./Admin/AdminPage/AdminOrders";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const normalizedOnLoad = useRef(false);

  // Facebook Meta Pixel - Track every route change
  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);

  // Keep your existing behavior
  useEffect(() => {
    if (!normalizedOnLoad.current) {
      normalizedOnLoad.current = true;

      if (
        location.pathname !== "/" &&
        !location.pathname.startsWith("/admin")
      ) {
        navigate("/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  // Restore admin session on refresh
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      dispatch(getAdminProfile());
    }
  }, [dispatch, location.pathname]);

  return (
    <>
      <Routes>
        {/* Public Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<PrivateAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="applications" element={<AdminApplication />} />
            <Route path="upi-settings" element={<AdminUpi />} />
            <Route
              path="amount-setting"
              element={<AdminAmountSetting />}
            />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<OwnPocketHome />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/verify-otp" element={<OwnPocketOtpVerify />} />
        <Route path="/apply-form" element={<OwnPocketApplicationForm />} />
        <Route path="/cibilcheck" element={<OwnPocketCibilCheck />} />
        <Route path="/Loanreview" element={<OwnPocketReviewSubmit />} />
        <Route path="/approvedpage" element={<OwnPocketApproved />} />
        <Route path="/bank-detail" element={<OwnPocketBankDetails />} />
        <Route path="/processing-fee" element={<OwnPocketProcessingFee />} />
        <Route
          path="/processing-payment"
          element={<PaymentCheckout />}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;