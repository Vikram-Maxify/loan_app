import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

const getErrorMessage = (err) =>
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong";

export const createPayment = createAsyncThunk(
    "payment/createPayment",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/create", body);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "payment/verifyPayment",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/verify", body);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const paymentFailed = createAsyncThunk(
    "payment/paymentFailed",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.post("/razorpay/failed", body);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

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

const initialState = {
    loading: false,
    success: false,
    error: null,
    order: null,
    payment: null,
    payments: [],
    total: 0,
};

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
        },
        resetPaymentState() {
            return initialState;
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
            .addCase(createPayment.pending, pending)
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.order;
                state.payment = action.payload.payment;
            })
            .addCase(createPayment.rejected, rejected)

            .addCase(verifyPayment.pending, pending)
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
            })
            .addCase(verifyPayment.rejected, rejected)

            .addCase(paymentFailed.pending, pending)
            .addCase(paymentFailed.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
            })
            .addCase(paymentFailed.rejected, rejected)

            .addCase(getAllPayments.pending, pending)
            .addCase(getAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payments = action.payload.payments || [];
                state.total = action.payload.total || 0;
            })
            .addCase(getAllPayments.rejected, rejected)

            .addCase(getPaymentById.pending, pending)
            .addCase(getPaymentById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.payment = action.payload.payment;
            })
            .addCase(getPaymentById.rejected, rejected);
    },
});

export const {
    clearPaymentError,
    clearPaymentSuccess,
    clearPayment,
    resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
