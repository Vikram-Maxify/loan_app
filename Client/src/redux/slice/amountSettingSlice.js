import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "./API";


// Get Amount
export const getAmountSetting = createAsyncThunk(
  "amountSetting/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/amount-setting`
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// Update Amount
export const updateAmountSetting = createAsyncThunk(
  "amountSetting/update",
  async (amount, { rejectWithValue }) => {
    try {
      const { data } = await API.put(
        `/amount-setting/update-amount`,
        { amount },
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const amountSettingSlice = createSlice({
  name: "amountSetting",
  initialState: {
    amount: 259,
    loading: false,
    error: null,
    success: false,
    message: "",
  },

  reducers: {
    clearAmountState: (state) => {
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getAmountSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAmountSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.amount = action.payload.amount;
      })
      .addCase(getAmountSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAmountSetting.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAmountSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.amount = action.payload.data.amount;
      })
      .addCase(updateAmountSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAmountState } = amountSettingSlice.actions;

export default amountSettingSlice.reducer;