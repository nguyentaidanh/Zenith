import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { useStore } from "../context/StoreContext";
import { Order } from "../types";
import * as api from "../utils/api";

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

export const ProfilePage: React.FC = () => {
  const { state, logout } = useStore();
  const { user, isAuthenticated } = state.auth;
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const userOrders = await api.getUserOrders();
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome, {user.name}
            </h1>
            <p className="mt-1 text-gray-500">{user.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="mt-4 md:mt-0"
          >
            Log Out
          </Button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order History
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-8">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        {/* <p className="text-lg font-semibold text-gray-900">${order.total.toFixed(2)}</p> */}
                        <p className="text-lg font-semibold text-gray-900">
                          ${order.total}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="sr-only">Items</h4>
                      <ul className="space-y-4">
                        {order.items.map((item) => (
                          <li
                            key={item.id + Math.random()}
                            className="flex items-center justify-between space-x-4"
                          >
                            <Link
                              to={`/products/${item.id}`}
                              className="flex items-center space-x-4 flex-grow group"
                            >
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-16 h-16 rounded-md object-cover group-hover:opacity-80 transition-opacity"
                              />
                              <div className="flex-grow">
                                <p className="font-medium text-gray-900 group-hover:text-accent transition-colors">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </Link>
                            {/* <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p> */}
                            <p className="font-medium text-gray-900">
                              ${item.price * item.quantity}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You have no past orders.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
