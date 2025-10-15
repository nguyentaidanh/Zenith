import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "../../components/Spinner";
import { Order } from "../../types";
import * as api from "../../utils/api";

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Shipped":
      return "bg-blue-100 text-blue-800";
    case "Processing":
      return "bg-yellow-100 text-yellow-800";
    case "Pending":
      return "bg-gray-100 text-gray-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const AdminOrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  const orderStatuses: Order["status"][] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const statusMatch =
        statusFilter === "all" || order.status === statusFilter;
      const searchMatch =
        !searchTerm ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [orders, statusFilter, searchTerm]);

  const renderTableBody = () => {
    if (loading)
      return (
        <tr>
          <td colSpan={5} className="text-center py-8">
            <Spinner />
          </td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td colSpan={5} className="text-center py-8 text-red-500">
            {error}
          </td>
        </tr>
      );
    if (filteredOrders.length === 0)
      return (
        <tr>
          <td colSpan={5} className="text-center py-8 text-gray-500">
            No orders match the current filters.
          </td>
        </tr>
      );

    return filteredOrders.map((order) => (
      <tr key={order.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {order.id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.customerName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(order.date).toLocaleDateString()}
        </td>
        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td> */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${order.total}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
          <select
            value={order.status}
            onChange={(e) =>
              handleStatusChange(order.id, e.target.value as Order["status"])
            }
            className={`border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-xs p-1 ${getStatusColor(
              order.status
            )} border-0`}
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Orders</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search-orders"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              type="text"
              id="search-orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order ID or Customer Name"
              className="mt-1 block w-full input-field"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="mt-1 block w-full input-field"
            >
              <option value="all">All Statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Order ID</th>
                <th className="th-cell">Customer</th>
                <th className="th-cell">Date</th>
                <th className="th-cell">Total</th>
                <th className="th-cell">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.input-field { pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md } .th-cell { px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider }`}</style>
    </div>
  );
};
