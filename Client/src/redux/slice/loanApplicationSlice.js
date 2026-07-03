import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

const getErrorMessage = (err) =>
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong";

// ======================================================
// CREATE LOAN APPLICATION
// ======================================================

export const createLoanApplication = createAsyncThunk(
    "loanApplication/createLoanApplication",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.post("/loan/create");

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SAVE STEP 1
// ======================================================

export const saveStep1 = createAsyncThunk(
    "loanApplication/saveStep1",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/step1", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SAVE STEP 2
// ======================================================

export const saveStep2 = createAsyncThunk(
    "loanApplication/saveStep2",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/step2", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SAVE STEP 3
// ======================================================

export const saveStep3 = createAsyncThunk(
    "loanApplication/saveStep3",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/step3", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SAVE STEP 4
// ======================================================

export const saveStep4 = createAsyncThunk(
    "loanApplication/saveStep4",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/step4", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SAVE STEP 5
// ======================================================

export const saveStep5 = createAsyncThunk(
    "loanApplication/saveStep5",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/step5", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// SUBMIT APPLICATION
// ======================================================

export const submitApplication = createAsyncThunk(
    "loanApplication/submitApplication",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.put("/loan/submit", body);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// GET MY APPLICATIONS
// ======================================================

export const getMyApplications = createAsyncThunk(
    "loanApplication/getMyApplications",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.get("/loan/my-applications");

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// GET APPLICATION BY ID
// ======================================================

export const getApplicationById = createAsyncThunk(
    "loanApplication/getApplicationById",
    async (id, thunkAPI) => {
        try {
            const { data } = await API.get(`/loan/${id}`);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// DELETE APPLICATION
// ======================================================

export const deleteApplication = createAsyncThunk(
    "loanApplication/deleteApplication",
    async (id, thunkAPI) => {
        try {
            await API.delete(`/loan/${id}`);

            return id;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(err)
            );
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    loading: false,
    success: false,
    error: null,

    application: null,
    applications: [],
};

const loanApplicationSlice = createSlice({
    name: "loanApplication",

    initialState,

    reducers: {
        clearApplication(state) {
            state.application = null;
        },

        clearApplications(state) {
            state.applications = [];
        },

        clearLoanError(state) {
            state.error = null;
        },

        resetLoanSuccess(state) {
            state.success = false;
        },

        resetLoanApplicationState() {
            return initialState;
        },
    },

    extraReducers: (builder) => {
        builder

            // ================= CREATE APPLICATION =================

            .addCase(createLoanApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createLoanApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(createLoanApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= STEP 1 =================

            .addCase(saveStep1.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(saveStep1.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(saveStep1.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= STEP 2 =================

            .addCase(saveStep2.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(saveStep2.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(saveStep2.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= STEP 3 =================

            .addCase(saveStep3.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(saveStep3.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(saveStep3.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= STEP 4 =================

            .addCase(saveStep4.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(saveStep4.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(saveStep4.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= STEP 5 =================

            .addCase(saveStep5.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(saveStep5.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(saveStep5.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= SUBMIT APPLICATION =================

            .addCase(submitApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(submitApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(submitApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= GET MY APPLICATIONS =================

            .addCase(getMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.applications = action.payload.applications;
            })

            .addCase(getMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= GET APPLICATION BY ID =================

            .addCase(getApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.application;
            })

            .addCase(getApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================= DELETE APPLICATION =================

            .addCase(deleteApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                state.applications = state.applications.filter(
                    (application) => application._id !== action.payload
                );

                if (state.application?._id === action.payload) {
                    state.application = null;
                }
            })

            .addCase(deleteApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearApplication,
    clearApplications,
    clearLoanError,
    resetLoanSuccess,
    resetLoanApplicationState,
} = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;
