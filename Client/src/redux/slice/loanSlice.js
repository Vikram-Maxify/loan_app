import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

const getErrorMessage = (err) =>
  err.response?.data?.message ||
  err.response?.data?.error ||
  err.message ||
  "Something went wrong";

// =======================
// Get All Loans
// =======================

export const getAllLoans = createAsyncThunk(
  "loan/getAllLoans",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/admin/loans");

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

// =======================
// Get Loan By ID
// =======================

export const getLoanById = createAsyncThunk(
  "loan/getLoanById",
  async (id, thunkAPI) => {
    try {
      const { data } = await API.get(`/admin/loans/${id}`);

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

// =======================
// Delete Loan
// =======================

export const deleteLoan = createAsyncThunk(
  "loan/deleteLoan",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/admin/loans/${id}`);

      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,

  loans: [],
  loan: null,
};

const loanSlice = createSlice({
  name: "loan",

  initialState,

  reducers: {
    clearLoan(state) {
      state.loan = null;
    },

    clearLoans(state) {
      state.loans = [];
    },
    clearLoanError(state) {
      state.error = null;
    },
    clearLoanSuccess(state) {
      state.success = false;
    },
    resetLoanState() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Get All Loans =================

      .addCase(getAllLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.loans = action.payload.loans;
      })

      .addCase(getAllLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Get Loan By ID =================

      .addCase(getLoanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getLoanById.fulfilled, (state, action) => {
        state.loading = false;
        state.loan = action.payload.loan;
      })

      .addCase(getLoanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Delete Loan =================

      .addCase(deleteLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.loading = false;

        state.loans = state.loans.filter(
          (loan) => loan._id !== action.payload
        );
      })

      .addCase(deleteLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLoan, clearLoans, clearLoanError, clearLoanSuccess, resetLoanState } = loanSlice.actions;

export default loanSlice.reducer;
