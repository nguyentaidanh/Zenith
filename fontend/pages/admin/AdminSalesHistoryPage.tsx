import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { StatCard } from "../../components/admin/StatCard";
import { Spinner } from "../../components/Spinner";
import { Order, Product } from "../../types";
import * as api from "../../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DollarSignIcon = () => (
  <svg
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
const HashIcon = () => (
  <svg
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);
const ShoppingBagIcon = () => (
  <svg
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const StarIcon = () => (
  <svg
    className="h-6 w-6"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const AdminSalesHistoryPage: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<"all" | "30d" | "7d">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersData, productsData] = await Promise.all([
          api.getAdminOrders(),
          api.getProducts(),
        ]);
        setAllOrders(ordersData);
        setAllProducts(productsData);
      } catch (err) {
        setError("Failed to load sales data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allProducts.map((p) => p.category)))],
    [allProducts]
  );

  const filteredOrders = useMemo(() => {
    let orders: Order[] = [...allOrders];
    if (dateFilter !== "all") {
      const days = dateFilter === "30d" ? 30 : 7;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      orders = orders.filter((order) => new Date(order.date) >= cutoffDate);
    }
    if (productFilter !== "all") {
      orders = orders.filter((order) =>
        order.items.some((item) => item.id.toString() === productFilter)
      );
    }
    if (categoryFilter !== "all") {
      orders = orders.filter((order) =>
        order.items.some((item) => item.category === categoryFilter)
      );
    }
    return orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allOrders, dateFilter, productFilter, categoryFilter]);

  const analyticsData = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0);
    const orderCount = filteredOrders.length;
    const totalItemsSold = filteredOrders.reduce(
      (s, o) => s + o.items.reduce((iS, i) => iS + i.quantity, 0),
      0
    );
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
    const productSales = filteredOrders
      .flatMap((o) => o.items)
      .reduce(
        (acc, i) => ({ ...acc, [i.id]: (acc[i.id] || 0) + i.quantity }),
        {} as Record<string, number>
      );
    const bestId =
      Object.keys(productSales).length > 0
        ? Object.entries(productSales).sort(
            (a: any, b: any) => b[1] - a[1]
          )[0][0]
        : null;
    const bestSellingProduct = bestId
      ? allProducts.find((p) => p.id.toString() === bestId)?.name
      : "N/A";
    return {
      totalRevenue,
      totalItemsSold,
      averageOrderValue,
      bestSellingProduct,
    };
  }, [filteredOrders, allProducts]);

  const salesChartData = useMemo(() => {
    const dataMap: { [key: string]: number } = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.date).toISOString().split("T")[0];
      dataMap[date] = (dataMap[date] || 0) + order.total;
    });
    const sorted = Object.entries(dataMap).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return { labels: sorted.map(([l]) => l), data: sorted.map(([, v]) => v) };
  }, [filteredOrders]);

  const chartData = {
    labels: salesChartData.labels,
    datasets: [
      {
        label: "Sales Revenue",
        data: salesChartData.data,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        tension: 0.2,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v: any) => `$${v}` } },
    },
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Sales History & Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {/* <StatCard title="Revenue" value={`$${analyticsData.totalRevenue.toFixed(2)}`} icon={<DollarSignIcon />} /> */}
        <StatCard
          title="Revenue"
          value={`$${analyticsData.totalRevenue}`}
          icon={<DollarSignIcon />}
        />
        {/* <StatCard title="Avg. Order" value={`$${analyticsData.averageOrderValue.toFixed(2)}`} icon={<HashIcon />} /> */}
        <StatCard
          title="Avg. Order"
          value={`$${analyticsData.averageOrderValue}`}
          icon={<HashIcon />}
        />
        <StatCard
          title="Items Sold"
          value={analyticsData.totalItemsSold}
          icon={<ShoppingBagIcon />}
        />
        <StatCard
          title="Best-Seller"
          value={analyticsData.bestSellingProduct}
          icon={<StarIcon />}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md my-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Date Range
            </label>
            <select
              id="date-filter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="product-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </label>
            <select
              id="product-filter"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All" : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md h-80">
        <Line options={chartOptions} data={chartData} />
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Filtered Orders ({filteredOrders.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Order ID</th>
                <th className="th-cell">Date</th>
                <th className="th-cell">Customer</th>
                <th className="th-cell">Items</th>
                <th className="th-cell">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {/* ${order.total.toFixed(2)} */}${order.total}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No sales match filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.filter-select { margin-top: 0.25rem; display: block; width: 100%; padding-left: 0.75rem; padding-right: 2.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 1rem; line-height: 1.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; } .th-cell { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; line-height: 1rem; font-weight: 500; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; }`}</style>
    </div>
  );
};
