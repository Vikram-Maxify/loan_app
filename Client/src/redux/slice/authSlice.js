import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

// ================= SEND OTP =================

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (mobile, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/send-otp", {
        mobile,
      });

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= VERIFY OTP =================

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ mobile, otp }, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/verify-otp", {
        mobile,
        otp,
      });

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= COMPLETE PROFILE =================

export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async (body, thunkAPI) => {
    try {
      const { data } = await API.put("/auth/complete-profile", body);

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= ACCEPT TERMS =================

export const acceptTerms = createAsyncThunk(
  "auth/acceptTerms",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.put("/auth/accept-terms");

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= GET PROFILE =================

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/profile");

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= LOGOUT =================

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/logout");

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ================= INITIAL STATE =================

const initialState = {
  loading: false,
  error: null,
  success: false,

  user: null,
};

// ================= SLICE =================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= SEND OTP =================

      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= VERIFY OTP =================

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
      })

      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= COMPLETE PROFILE =================

      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ACCEPT TERMS =================

      .addCase(acceptTerms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(acceptTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(acceptTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET PROFILE =================

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= LOGOUT =================

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.success = false;
        state.user = null;
      })

      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;