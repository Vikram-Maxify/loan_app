import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import adminReducer from "./slice/adminSlice";
import loanReducer from "./slice/loanSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        loan: loanReducer,



    },
});