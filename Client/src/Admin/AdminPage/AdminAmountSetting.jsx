import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAmountState,
  getAmountSetting,
  updateAmountSetting,
} from "../../redux/slice/amountSettingSlice";
import { toast } from "react-toastify";

const AdminAmountSetting = () => {
  const dispatch = useDispatch();

  const { amount, loading, success, message, error } = useSelector(
    (state) => state.amountSetting
  );

  const [newAmount, setNewAmount] = useState(259);

  useEffect(() => {
    dispatch(getAmountSetting());
  }, [dispatch]);

  useEffect(() => {
    setNewAmount(amount);
  }, [amount]);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(clearAmountState());
    }

    if (error) {
      toast.error(error);
      dispatch(clearAmountState());
    }
  }, [success, error, message, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateAmountSetting(Number(newAmount)));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            Amount Setting
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Update the default amount for users.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={submitHandler} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Amount
            </label>

            <input
              type="number"
              min="0"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Updating...
              </div>
            ) : (
              "Update Amount"
            )}
          </button>

          {/* Current Amount */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-gray-700 text-sm">
              Current Amount
            </p>

            <h3 className="mt-1 text-3xl font-bold text-green-600">
              ₹{amount}
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAmountSetting;