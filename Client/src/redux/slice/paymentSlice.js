import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

const getErrorMessage = (err) =>
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong";

// ================= CREATE PAYMENT =================
export const createPayment = createAsyncThunk(
    "payment/createPayment",
    async ({ applicationId, amount }, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/create", {
                applicationId,
                amount,
            });
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= VERIFY PAYMENT =================
export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/verify", {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= PAYMENT FAILED =================
export const paymentFailed = createAsyncThunk(
    "payment/paymentFailed",
    async ({ razorpay_order_id, reason }, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/failed", {
                razorpay_order_id,
                reason,
            });
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= GET ALL PAYMENTS =================
export const getAllPayments = createAsyncThunk(
    "payment/getAllPayments",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.get("/razorpay");
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= GET PAYMENT BY ID =================
export const getPaymentById = createAsyncThunk(
    "payment/getPaymentById",
    async (id, thunkAPI) => {
        try {
            const { data } = await API.get(`/razorpay/${id}`);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= GET MY ORDERS =================
export const getMyOrders = createAsyncThunk(
    "payment/getMyOrders",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.get("/razorpay/my-orders");
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

// ================= INITIAL STATE =================
const initialState = {
    loading: false,
    success: false,
    error: null,
    order: null,
    payment: null,
    payments: [],
    total: 0,
    // Payment status tracking
    paymentStatus: null, // 'created' | 'success' | 'failed'
    razorpayOrderId: null,
    razorpayPaymentId: null,
};

// ================= SLICE =================
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentError(state) {
            state.error = null;
        },
        clearPaymentSuccess(state) {
            state.success = false;
        },
        clearPayment(state) {
            state.order = null;
            state.payment = null;
            state.paymentStatus = null;
            state.razorpayOrderId = null;
            state.razorpayPaymentId = null;
        },
        resetPaymentState() {
            return initialState;
        },
        // For handling Razorpay response directly in component
        setRazorpayOrderId(state, action) {
            state.razorpayOrderId = action.payload;
        },
        setPaymentStatus(state, action) {
            state.paymentStatus = action.payload;
        },
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const rejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            // ================= CREATE PAYMENT =================
            .addCase(createPayment.pending, pending)
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.payment = action.payload.payment;
                state.paymentStatus = action.payload.payment?.status || 'created';
                state.razorpayOrderId = action.payload.order?.id || null;
            })
            .addCase(createPayment.rejected, rejected)

            // ================= VERIFY PAYMENT =================
            .addCase(verifyPayment.pending, pending)
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
                state.paymentStatus = 'success';
                state.razorpayPaymentId = action.payload.payment?.razorpayPaymentId || null;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.paymentStatus = 'failed';
            })

            // ================= PAYMENT FAILED =================
            .addCase(paymentFailed.pending, pending)
            .addCase(paymentFailed.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
                state.paymentStatus = 'failed';
            })
            .addCase(paymentFailed.rejected, rejected)

            // ================= GET ALL PAYMENTS =================
            .addCase(getAllPayments.pending, pending)
            .addCase(getAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payments = action.payload.payments || [];
                state.total = action.payload.total || 0;
            })
            .addCase(getAllPayments.rejected, rejected)

            // ================= GET PAYMENT BY ID =================
            .addCase(getPaymentById.pending, pending)
            .addCase(getPaymentById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
            })
            .addCase(getPaymentById.rejected, rejected)

            // ================= GET MY ORDERS =================
            .addCase(getMyOrders.pending, pending)
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payments = action.payload.payments || [];
                state.total = action.payload.total || 0;
            })
            .addCase(getMyOrders.rejected, rejected);
    },
});

// ================= EXPORT ACTIONS =================
export const {
    clearPaymentError,
    clearPaymentSuccess,
    clearPayment,
    resetPaymentState,
    setRazorpayOrderId,
    setPaymentStatus,
} = paymentSlice.actions;

export default paymentSlice.reducer;