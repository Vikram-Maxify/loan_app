import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./API";

// =======================
// Admin Login
// =======================

export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ mobile, password }, thunkAPI) => {
    try {
      const { data } = await API.post("/admin/login", {
        mobile,
        password,
      });

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// =======================
// Get Admin Profile
// =======================

export const getAdminProfile = createAsyncThunk(
  "admin/profile",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/admin/profile");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// =======================
// Get All Users
// =======================

export const getAllUsers = createAsyncThunk(
  "admin/users",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/admin/users");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// =======================
// Logout
// =======================

export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.post("/admin/logout");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// =======================
// Initial State
// =======================

const initialState = {
  loading: false,
  error: null,
  success: false,

  admin: null,
  users: [],
};

// =======================
// Slice
// =======================

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdmin(state) {
      state.admin = null;
      state.users = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Login =================

      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.admin = action.payload.admin;
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Profile =================

      .addCase(getAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
      })

      .addCase(getAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Users =================

      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })

      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Logout =================

      .addCase(adminLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(adminLogout.fulfilled, (state) => {
        state.loading = false;
        state.success = false;
        state.admin = null;
        state.users = [];
      })

      .addCase(adminLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdmin } = adminSlice.actions;

export default adminSlice.reducer;