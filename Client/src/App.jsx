import './App.css'
import Homepage from './Pages/Homepage'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import OwnPocketOtpVerify from './Pages/OtpVerify'
import OwnPocketHome from './Pages/LoanHome'
import OwnPocketApplicationForm from './Pages/ApplicationForm'
import OwnPocketCibilCheck from './Pages/CibilCheck'
import OwnPocketApproved from './Pages/ApprovedPage'
import OwnPocketReviewSubmit from './Pages/LoanReview'
import OwnPocketBankDetails from './Pages/BankDetails'
import OwnPocketProcessingFee from './Pages/ProcessingFee'
import AdminLayout from './Admin/AdminCOmponent/AdminLayout'
import UsersPage from './Admin/AdminPage/UserPage'
import PaymentCheckout from './Pages/PaymentPage'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const normalizedOnLoad = useRef(false)

  useEffect(() => {
    if (!normalizedOnLoad.current) {
      normalizedOnLoad.current = true
      if (location.pathname !== '/' && !location.pathname.startsWith('/admin')) {
        navigate('/', { replace: true })
      }
    }
  }, [location.pathname, navigate])

  return (
    <>
      
    <Routes >
      {/* Admin Routes - Nested */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route path="dashboard" element={<DashboardPage />} /> /admin/dashboard */}
          <Route path="users" element={<UsersPage />} />          {/* /admin/users */}
          {/* <Route path="settings" element={<SettingsPage />} />    /admin/settings */}
        </Route>

        
        <Route path='/home' element={<Homepage />} />
        <Route path='/verify-otp' element={<OwnPocketOtpVerify />} />
        <Route path='/' element={<OwnPocketHome />} />
        <Route path='/apply-form' element={<OwnPocketApplicationForm />} />
        <Route path='/cibilcheck' element={<OwnPocketCibilCheck />} />
        <Route path='/Loanreview' element={<OwnPocketReviewSubmit />} />
        <Route path='/approvedpage' element={<OwnPocketApproved />} />
        <Route path='/bank-detail' element={<OwnPocketBankDetails />} />
        <Route path='/processing-fee' element={<OwnPocketProcessingFee />} />
        <Route path='/processing-payment' element={<PaymentCheckout />} />
      </Routes>
    </>
  )
}

export default App
