import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/slice/orderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { loading, orders = [] } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Show only one order per user (latest order)
  const filteredOrders = useMemo(() => {
    // Search by Order ID
    const filtered = orders.filter((item) =>
      item.orderId?.toLowerCase().includes(search.toLowerCase())
    );

    // Remove duplicate users
    const seenUsers = new Set();

    return filtered.filter((order) => {
      const userId = order.user?._id;

      // If user data is missing, show the order
      if (!userId) return true;

      // Skip duplicate user
      if (seenUsers.has(userId)) {
        return false;
      }

      seenUsers.add(userId);
      return true;
    });
  }, [orders, search]);

  // Status badge color mapping
  const getStatusBadge = (status) => {
    const colors = {
      Success: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full px-4 py-4 md:px-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-xl font-semibold text-gray-800">
            All Orders ({filteredOrders.length})
          </h4>

          <button
            onClick={() => dispatch(getAllOrders())}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
          >
            Refresh
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Search */}
          <div className="mb-4 max-w-md">
            <input
              type="text"
              placeholder="Search Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="px-4 py-3 font-semibold">
                          {order.orderId}
                        </td>

                        <td className="px-4 py-3 text-xs font-mono">
                          {order.user?._id || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {order.user?.fullName || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {order.user?.mobile || "-"}
                        </td>

                        <td className="px-4 py-3">
                          {order.user?.email || "-"}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          ₹ {order.amount}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        {search
                          ? "No orders found matching your search."
                          : "No Orders Found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;