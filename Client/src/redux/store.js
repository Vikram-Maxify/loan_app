import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import adminReducer from "./slice/adminSlice";
import loanReducer from "./slice/loanSlice";
import loanApplicationReducer from "./slice/loanApplicationSlice";
import applicationReducer from "./slice/applicationSlice";
import paymentReducer from "./slice/paymentSlice";
import adminApplicationReducer from "./slice/adminApplicationSlice";
import upiReducer from "./slice/adminUpiSlice"
import userUpiReducer from "./slice/userUpiSlice";
import amountSettingReducer from "./slice/amountSettingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        loan: loanReducer,
        loanApplication: loanApplicationReducer,
        application: applicationReducer,
        payment: paymentReducer,
        adminApplication: adminApplicationReducer,
        upi: upiReducer,
        userUpi: userUpiReducer,
        amountSetting: amountSettingReducer,

    },
});
