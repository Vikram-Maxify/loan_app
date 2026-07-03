import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Homepage from './Pages/Homepage'
import { Route, Routes } from 'react-router-dom'
import YourLoanOtpVerify from './Pages/OtpVerify'
import YourLoanHome from './Pages/LoanHome'
import YourLoanApplicationForm from './Pages/ApplicationForm'
import YourLoanCibilCheck from './Pages/CibilCheck'
import YourLoanApproved from './Pages/ApprovedPage'
import YourLoanReviewSubmit from './Pages/LoanReview'
import YourLoanBankDetails from './Pages/BankDetails'
import YourLoanProcessingFee from './Pages/ProcessingFee'
import AdminLayout from './Admin/AdminCOmponent/AdminLayout'
import UsersPage from './Admin/AdminPage/UserPage'

function App() {
  const [count, setCount] = useState(0)

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
        <Route path='/verify-otp' element={<YourLoanOtpVerify />} />
        <Route path='/' element={<YourLoanHome />} />
        <Route path='/apply-form' element={<YourLoanApplicationForm />} />
        <Route path='/cibilcheck' element={<YourLoanCibilCheck />} />
        <Route path='/Loanreview' element={<YourLoanReviewSubmit />} />
        <Route path='/approvedpage' element={<YourLoanApproved />} />
        <Route path='/bank-detail' element={<YourLoanBankDetails />} />
        <Route path='/processing-fee' element={<YourLoanProcessingFee />} />
      </Routes>
    </>
  )
}

export default App
