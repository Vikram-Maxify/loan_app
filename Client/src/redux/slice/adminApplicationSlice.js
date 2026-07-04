// src/redux/slices/adminApplicationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

// ===============================
// Get All Applications
// ===============================
// Get All Applications
export const getAllApplications = createAsyncThunk(
    "adminApplication/getAllApplications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/application");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get Application By ID
export const getApplicationById = createAsyncThunk(
    "adminApplication/getApplicationById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/application/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get Logged In User Applications
export const getApplicationsByUserId = createAsyncThunk(
    "adminApplication/getApplicationsByUserId",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get("/application/my-applications");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    applications: [],
    application: null,
    loading: false,
    error: null,
};

const adminApplicationSlice = createSlice({
    name: "adminApplication",
    initialState,
    reducers: {
        clearApplication: (state) => {
            state.application = null;
        },
        clearApplications: (state) => {
            state.applications = [];
        },
        clearApplicationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getAllApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
            })
            .addCase(getAllApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get By ID
            .addCase(getApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.application = action.payload.data;
            })
            .addCase(getApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get User Applications
            .addCase(getApplicationsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getApplicationsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.data;
            })
            .addCase(getApplicationsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearApplication,
    clearApplications,
    clearApplicationError,
} = adminApplicationSlice.actions;

export default adminApplicationSlice.reducer;