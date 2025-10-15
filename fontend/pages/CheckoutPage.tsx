import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useStore } from "../context/StoreContext";
import * as api from "../utils/api";

export const CheckoutPage: React.FC = () => {
  const { state, cartTotal, dispatch } = useStore();
  const { items: cart } = state.cart;
  const { user } = state.auth;
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      fullName: formData.get("fullName") as string,
      street: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      country: "USA",
    };

    const orderPayload = {
      items: cart,
      total: cartTotal,
      shippingAddress,
      customerName: user?.name || shippingAddress.fullName,
      customerEmail: user?.email || (formData.get("email") as string),
    };

    try {
      const newOrder = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${newOrder.id}`, {
        state: { order: newOrder },
      });
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !isProcessing) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Your cart is empty.
        </h1>
        <p className="mt-2 text-gray-600">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Button onClick={() => navigate("/products")} className="mt-6">
          Shop Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Checkout
        </h1>
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
          {/* Shipping and Payment Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping Information
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required
                      className="input-field"
                      defaultValue={user?.name || ""}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      className="input-field"
                      defaultValue={user?.email || ""}
                      readOnly={!!user}
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      required
                      className="sm:col-span-2 input-field"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State / Province"
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP / Postal Code"
                      required
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    This is a simulated payment form.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-y-6">
                    <input
                      type="text"
                      placeholder="Card Number"
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Name on Card"
                      required
                      className="input-field"
                    />
                    <div className="grid grid-cols-3 gap-x-4">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        required
                        className="input-field col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        required
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full mt-8"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Place Order ($${cartTotal})`}
                {/* {isProcessing ? 'Processing...' : `Place Order ($${cartTotal.toFixed(2)})`} */}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>
              <ul className="divide-y divide-gray-200 mt-4">
                {cart.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-900 font-medium">
                          ${item.price * item.quantity}
                          {/* ${(item.price * item.quantity).toFixed(2)} */}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <dl className="space-y-2">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <dt>Order Total</dt>
                    {/* <dd>${cartTotal.toFixed(2)}</dd> */}
                    <dd>${cartTotal}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.input-field { width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .input-field:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }`}</style>
    </div>
  );
};
