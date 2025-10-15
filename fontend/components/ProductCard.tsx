import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Product } from "../types";

const HeartIcon: React.FC<{ isFilled: boolean; className?: string }> = ({
  isFilled,
  className,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={isFilled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, dispatch } = useStore();
  const primaryVariant =
    product.variants.length > 0 ? product.variants[0] : null;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      dispatch({
        type: "REMOVE_FROM_WISHLIST",
        payload: { productId: product.id },
      });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: product });
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
      <button
        onClick={handleWishlistToggle}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors ${
          isWishlisted
            ? "text-red-500 bg-red-100"
            : "text-gray-400 bg-white/60 backdrop-blur-sm hover:text-red-500 hover:bg-red-100"
        }`}
      >
        <HeartIcon isFilled={isWishlisted} className="w-5 h-5" />
      </button>

      <Link to={`/products/${product.id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          />
        </div>
        <div className="p-4 flex flex-col">
          <h3 className="text-sm text-gray-700 font-medium">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">{product.category}</p>
            {primaryVariant && (
              <p className="text-xs text-gray-500">
                {primaryVariant.options.length}{" "}
                {primaryVariant.name.toLowerCase() === "color"
                  ? "Colors"
                  : "Options"}
              </p>
            )}
          </div>
          <p className="mt-2 text-lg font-semibold text-primary">
            {/* ${product.price?.toFixed(2)} */}${product.price}
          </p>
        </div>
      </Link>
    </div>
  );
};
