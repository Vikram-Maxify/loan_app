import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

const getErrorMessage = (err) =>
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Something went wrong";

export const createApplication = createAsyncThunk(
    "application/createApplication",
    async (body, thunkAPI) => {
        try {
            const { data } = await API.post("/application/create", body);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const acceptApplicationTerms = createAsyncThunk(
    "application/acceptApplicationTerms",
    async ({ applicationId, termsAccepted }, thunkAPI) => {
        try {
            const { data } = await API.put(
                `/application/${applicationId}/accept-terms`,
                { termsAccepted }
            );
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const updateAccountDetails = createAsyncThunk(
    "application/updateAccountDetails",
    async ({ applicationId, accountDetails }, thunkAPI) => {
        try {
            const { data } = await API.put(
                `/application/${applicationId}/account-details`,
                accountDetails
            );
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const getAllApplications = createAsyncThunk(
    "application/getAllApplications",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.get("/application");
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const getMyApplications = createAsyncThunk(
    "application/getMyApplications",
    async (_, thunkAPI) => {
        try {
            const { data } = await API.get("/application/my-applications");
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(getErrorMessage(err));
        }
    }
);

export const getApplicationById = createAsyncThunk(
    "application/getApplicationById",
    async (id, thunkAPI) => {
        try {
            const { data } = await API.get(`/application/${id}`);
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
    message: null,
    count: 0,
    application: null,
    applications: [],
    formDraft: JSON.parse(localStorage.getItem("applicationFormDraft") || "null"),
    cibilData: JSON.parse(localStorage.getItem("cibilData") || "null"),
    bankDraft: JSON.parse(localStorage.getItem("bankDetails") || "null"),
};

const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        clearApplicationError(state) {
            state.error = null;
        },
        clearApplicationSuccess(state) {
            state.success = false;
            state.message = null;
        },
        clearApplication(state) {
            state.application = null;
        },
        resetApplicationState() {
            return initialState;
        },
        setApplicationFormDraft(state, action) {
            state.formDraft = action.payload;
            localStorage.setItem("applicationFormDraft", JSON.stringify(action.payload));
        },
        setCibilDraft(state, action) {
            state.cibilData = action.payload;
            localStorage.setItem("cibilData", JSON.stringify(action.payload));
        },
        setBankDraft(state, action) {
            state.bankDraft = action.payload;
            localStorage.setItem("bankDetails", JSON.stringify(action.payload));
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
            .addCase(createApplication.pending, pending)
            .addCase(createApplication.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.application = action.payload.data;
                if (action.payload.data) {
                    state.applications = [
                        action.payload.data,
                        ...state.applications.filter(
                            (item) => item._id !== action.payload.data._id
                        ),
                    ];
                    state.count = state.applications.length;
                }
            })
            .addCase(createApplication.rejected, rejected)

            .addCase(acceptApplicationTerms.pending, pending)
            .addCase(acceptApplicationTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.application = action.payload.data;
                state.applications = state.applications.map((item) =>
                    item._id === action.payload.data?._id ? action.payload.data : item
                );
            })
            .addCase(acceptApplicationTerms.rejected, rejected)

            .addCase(updateAccountDetails.pending, pending)
            .addCase(updateAccountDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.application = action.payload.data;
                state.applications = state.applications.map((item) =>
                    item._id === action.payload.data?._id ? action.payload.data : item
                );
            })
            .addCase(updateAccountDetails.rejected, rejected)

            .addCase(getAllApplications.pending, pending)
            .addCase(getAllApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.applications = action.payload.data || [];
                state.count = action.payload.count || 0;
            })
            .addCase(getAllApplications.rejected, rejected)

            .addCase(getMyApplications.pending, pending)
            .addCase(getMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.applications = action.payload.data || [];
                state.count = action.payload.count || 0;
            })
            .addCase(getMyApplications.rejected, rejected)

            .addCase(getApplicationById.pending, pending)
            .addCase(getApplicationById.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.application = action.payload.data;
            })
            .addCase(getApplicationById.rejected, rejected);
    },
});

export const {
    clearApplicationError,
    clearApplicationSuccess,
    clearApplication,
    resetApplicationState,
    setApplicationFormDraft,
    setCibilDraft,
    setBankDraft,
} = applicationSlice.actions;

export default applicationSlice.reducer;
