import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useStore } from "../context/StoreContext";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const CartPage: React.FC = () => {
  const { state, dispatch, cartTotal, cartCount } = useStore();
  const { items: cart } = state.cart;

  const removeFromCart = (productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: { productId, quantity },
    });
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-500">Your cart is empty.</p>
            <Link to="/products">
              <Button className="mt-6">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>
              <ul
                role="list"
                className="border-t border-b border-gray-200 divide-y divide-gray-200"
              >
                {cart.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                to={`/products/${item.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm flex-col space-y-1">
                            {item.selectedVariant &&
                              Object.entries(item.selectedVariant).map(
                                ([name, option]) => (
                                  <p key={name} className="text-gray-500">
                                    <span className="text-gray-600 font-medium">
                                      {name}:
                                    </span>{" "}
                                    {option}
                                  </p>
                                )
                              )}
                          </div>
                          {/* <p className="mt-2 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p> */}
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            ${item.price}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label
                            htmlFor={`quantity-${item.id}`}
                            className="sr-only"
                          >
                            Quantity, {item.name}
                          </label>
                          <input
                            id={`quantity-${item.id}`}
                            name={`quantity-${item.id}`}
                            type="number"
                            className="w-20 rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value, 10)
                              )
                            }
                            min={1}
                          />
                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-white rounded-lg shadow-md p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    Subtotal ({cartCount} items)
                  </dt>
                  {/* <dd className="text-sm font-medium text-gray-900">${cartTotal.toFixed(2)}</dd> */}
                  <dd className="text-sm font-medium text-gray-900">
                    ${cartTotal}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Order total
                  </dt>
                  {/* <dd className="text-base font-medium text-gray-900">${cartTotal.toFixed(2)}</dd> */}
                  <dd className="text-base font-medium text-gray-900">
                    ${cartTotal}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link to="/checkout" className="w-full">
                  <Button className="w-full">Checkout</Button>
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
