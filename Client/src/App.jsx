import './App.css'
import Homepage from './Pages/Homepage'
import { Route, Routes } from 'react-router-dom'
import OnPocketOtpVerify from './Pages/OtpVerify'
import OnPocketHome from './Pages/LoanHome'
import OnPocketApplicationForm from './Pages/ApplicationForm'
import OnPocketCibilCheck from './Pages/CibilCheck'
import OnPocketApproved from './Pages/ApprovedPage'
import OnPocketReviewSubmit from './Pages/LoanReview'
import OnPocketBankDetails from './Pages/BankDetails'
import OnPocketProcessingFee from './Pages/ProcessingFee'
import AdminLayout from './Admin/AdminCOmponent/AdminLayout'
import UsersPage from './Admin/AdminPage/UserPage'
import PaymentCheckout from './Pages/PaymentPage'

function App() {
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
        <Route path='/verify-otp' element={<OnPocketOtpVerify />} />
        <Route path='/' element={<OnPocketHome />} />
        <Route path='/apply-form' element={<OnPocketApplicationForm />} />
        <Route path='/cibilcheck' element={<OnPocketCibilCheck />} />
        <Route path='/Loanreview' element={<OnPocketReviewSubmit />} />
        <Route path='/approvedpage' element={<OnPocketApproved />} />
        <Route path='/bank-detail' element={<OnPocketBankDetails />} />
        <Route path='/processing-fee' element={<OnPocketProcessingFee />} />
        <Route path='/processing-payment' element={<PaymentCheckout />} />
      </Routes>
    </>
  )
}

export default App
