import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/slice/orderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { loading, orders } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const filtered = [...orders]
      .filter((item) =>
        item.orderId.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const seen = new Set();

    return filtered.filter((order) => {
      const userId = order.user?._id;

      if (!userId || seen.has(userId)) return false;

      seen.add(userId);
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
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-xl font-semibold text-gray-800 m-0">
            All Orders
          </h4>

          <button
            onClick={() => dispatch(getAllOrders())}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>

        {/* Card Body */}
        <div className="px-6 py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="max-w-md">
              <input
                type="text"
                placeholder="Search Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Mobile</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3">{index + 1}</td>

                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {order.orderId}
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

                        <td className="px-4 py-3 font-medium text-gray-700">
                          ₹ {order.amount}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600">
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
                        colSpan="8"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No Orders Found
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