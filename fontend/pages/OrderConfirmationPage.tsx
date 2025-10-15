import React from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Order } from "../types";

export const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();
  const order = location.state?.order as Order | undefined;

  // If someone navigates here directly without an order in the state, redirect them.
  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Your order{" "}
            <span className="font-medium text-gray-900">#{order.id}</span> has
            been placed successfully.
          </p>
          <p className="mt-1 text-gray-500">
            We've sent a confirmation email to{" "}
            <span className="font-medium text-gray-900">
              {order.customerEmail}
            </span>
            .
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="py-4 flex">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="ml-4 flex-1 flex flex-col justify-center">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  {/* <p className="text-base font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p> */}
                  <p className="text-base font-medium text-gray-900">
                    ${item.price * item.quantity}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  {/* <dd className="text-gray-900">${order.total.toFixed(2)}</dd> */}
                  <dd className="text-gray-900">${order.total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Shipping</dt>
                  <dd className="text-gray-900">$0.00</dd>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <dt>Order Total</dt>
                  {/* <dd>${order.total.toFixed(2)}</dd> */}
                  <dd>${order.total}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Shipping to</h3>
            <div className="mt-2 text-gray-600">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zip}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
