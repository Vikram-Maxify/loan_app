import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

/* ===========================
   FETCH ADMIN UPI SETTINGS
=========================== */
export const fetchUserUpiSettings = createAsyncThunk(
    "userUpi/fetchUserUpiSettings",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get("/upi");
            return data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Unable to fetch UPI settings"
            );
        }
    }
);

/* ===========================
   GENERATE UPI QR
=========================== */
export const generateUserDepositUpiQR = createAsyncThunk(
    "userUpi/generateUserDepositUpiQR",
    async (payload, { rejectWithValue }) => {
        try {
            const body = typeof payload === "object" ? payload : { amount: payload };

            const { data } = await API.post(
                "/payment/generate-upi-qr",
                body,
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "QR generation failed"
            );
        }
    }
);

/* ===========================
   VERIFY CUSTOMER UPI ID
=========================== */
export const verifyCustomerUpiId = createAsyncThunk(
    "userUpi/verifyCustomerUpiId",
    async (upiId, { rejectWithValue }) => {
        try {
            const { data } = await API.post("/payment/verify-upi-id", { upiId });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "UPI verification failed"
            );
        }
    }
);

const userUpiSlice = createSlice({
    name: "userUpi",
    initialState: {
        loading: false,
        settingsLoading: false,
        settings: null,
        qrData: null,
        success: false,
        error: null,
        verifyLoading: false,
        verifyStatus: "idle",
        verifyMessage: null,
    },
    reducers: {
        resetUserUpiState: (state) => {
            state.loading = false;
            state.qrData = null;
            state.success = false;
            state.error = null;
        },
        resetUpiVerification: (state) => {
            state.verifyLoading = false;
            state.verifyStatus = "idle";
            state.verifyMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserUpiSettings.pending, (state) => {
                state.settingsLoading = true;
                state.error = null;
            })
            .addCase(fetchUserUpiSettings.fulfilled, (state, action) => {
                state.settingsLoading = false;
                state.settings = action.payload;
            })
            .addCase(fetchUserUpiSettings.rejected, (state, action) => {
                state.settingsLoading = false;
                state.error = action.payload;
            })
            .addCase(generateUserDepositUpiQR.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(generateUserDepositUpiQR.fulfilled, (state, action) => {
                state.loading = false;
                state.qrData = action.payload;
                state.success = true;
            })
            .addCase(generateUserDepositUpiQR.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            .addCase(verifyCustomerUpiId.pending, (state) => {
                state.verifyLoading = true;
                state.verifyStatus = "verifying";
                state.verifyMessage = "Verifying...";
            })
            .addCase(verifyCustomerUpiId.fulfilled, (state, action) => {
                state.verifyLoading = false;
                state.verifyStatus = action.payload?.verified ? "verified" : "invalid";
                state.verifyMessage = action.payload?.message || (
                    action.payload?.verified ? "Verified Successfully" : "Invalid UPI ID"
                );
            })
            .addCase(verifyCustomerUpiId.rejected, (state, action) => {
                state.verifyLoading = false;
                state.verifyStatus = "failed";
                state.verifyMessage = action.payload || "Verification Failed";
            });
    },
});

export const { resetUserUpiState, resetUpiVerification } = userUpiSlice.actions;

export default userUpiSlice.reducer;
