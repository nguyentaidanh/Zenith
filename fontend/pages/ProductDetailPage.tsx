import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { StarRating } from "../components/StarRating";
import { useStore } from "../context/StoreContext";
import { Product } from "../types";
import * as api from "../utils/api";
import { NotFoundPage } from "./NotFoundPage";

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({
  filled,
  className,
}) => (
  <svg
    className={`w-5 h-5 ${
      filled ? "text-yellow-400" : "text-gray-300"
    } ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const EyeIcon: React.FC = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
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
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, isInWishlist } = useStore();
  const { user, isAuthenticated, isAdmin } = state.auth;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const foundProduct = await api.getProductById(id);
      setProduct(foundProduct);
      setSelectedImage(0);
      setSelectedVariants({});
    } catch (err) {
      setError("Product not found.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      if (
        product.variants.length > 0 &&
        !product.variants.every((v) => selectedVariants[v.name])
      ) {
        alert("Please select all options before adding to cart.");
        return;
      }
      dispatch({
        type: "ADD_TO_CART",
        payload: { product, quantity, selectedVariant: selectedVariants },
      });
      alert(`${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        dispatch({
          type: "REMOVE_FROM_WISHLIST",
          payload: { productId: product.id },
        });
      } else {
        dispatch({ type: "ADD_TO_WISHLIST", payload: product });
      }
    }
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;
    if (newReviewRating === 0 || newReviewComment.trim() === "") {
      alert("Please provide a rating and a comment.");
      return;
    }

    try {
      await api.addProductReview(product.id, {
        author: user.name,
        rating: newReviewRating,
        comment: newReviewComment,
      });
      await fetchProduct(); // Re-fetch product to show new review
      setNewReviewRating(0);
      setNewReviewComment("");
      setHoverRating(0);
    } catch (err) {
      alert("Failed to submit review. Please try again.");
      console.error(err);
    }
  };

  const handleToggleVisibility = async (reviewId: number) => {
    if (!product) return;
    try {
      await api.toggleAdminReviewVisibility(product.id, reviewId);
      await fetchProduct(); // Re-fetch to reflect change
    } catch (err) {
      alert("Failed to update review visibility.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <NotFoundPage />;
  }

  if (!product) {
    return <NotFoundPage />;
  }

  const reviewsForDisplay = isAdmin
    ? product.reviews
    : product.reviews.filter((r) => !r.isHidden);
  const averageRating =
    reviewsForDisplay.length > 0
      ? reviewsForDisplay.reduce((acc, r) => acc + r.rating, 0) /
        reviewsForDisplay.length
      : 0;
  const allVariantsSelected = product.variants.every(
    (v) => selectedVariants[v.name]
  );
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="hidden w-full max-w-2xl mx-auto mt-6 sm:block lg:max-w-none">
              <div
                className="grid grid-cols-4 gap-6"
                aria-orientation="horizontal"
              >
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50 ${
                      selectedImage === index
                        ? "ring-2 ring-offset-2 ring-accent"
                        : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <span className="absolute inset-0 rounded-md overflow-hidden">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full aspect-w-1 aspect-h-1">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-center object-cover sm:rounded-lg"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex-1 pr-4">
                {product.name}
              </h1>
              {isAdmin && (
                <Link to={`/admin/products/edit/${product.id}`}>
                  <Button variant="secondary" className="!py-2 !px-3 text-sm">
                    Edit
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-3">
              <p className="text-3xl text-gray-900">
                {/* ${product.price.toFixed(2)} */}${product.price}
              </p>
            </div>

            {averageRating > 0 && (
              <div className="mt-3 flex items-center">
                <StarRating rating={averageRating} />
                <p className="ml-2 text-sm text-gray-500">
                  {reviewsForDisplay.length} reviews
                </p>
              </div>
            )}

            <div className="mt-6">
              <div
                className="text-base text-gray-700 space-y-6"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
              {product.variants.map((variant) => (
                <div key={variant.id} className="mt-4">
                  <h4 className="text-sm text-gray-900 font-medium">
                    {variant.name}
                  </h4>
                  <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          handleVariantChange(variant.name, option)
                        }
                        className={`border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 transition-all duration-200 ${
                          selectedVariants[variant.name] === option
                            ? "bg-accent text-white border-accent shadow-lg scale-105"
                            : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-10 flex space-x-4">
                <div>
                  <label htmlFor="quantity" className="sr-only">
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="border-gray-300 rounded-md shadow-sm w-20 focus:border-accent focus:ring-accent"
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1"
                  disabled={product.variants.length > 0 && !allVariantsSelected}
                >
                  {product.variants.length > 0 && !allVariantsSelected
                    ? "Select Options"
                    : "Add to cart"}
                </Button>
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-md border transition-colors ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  }`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <HeartIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          {reviewsForDisplay.length > 0 ? (
            <div className="mt-6 space-y-8">
              {reviewsForDisplay.map((review) => (
                <div
                  key={review.id}
                  className={`border-b border-gray-200 pb-6 last:border-b-0 last:pb-0 transition-all duration-300 ${
                    isAdmin && review.isHidden
                      ? "opacity-50 bg-yellow-50 p-4 -m-4 rounded-lg"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow pr-4">
                      <div className="flex items-center">
                        <StarRating rating={review.rating} />
                        <p className="ml-4 font-bold text-gray-900">
                          {review.author}
                        </p>
                        <p className="ml-2 text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                        {isAdmin && review.isHidden && (
                          <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-gray-600">{review.comment}</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleToggleVisibility(review.id)}
                        className="p-2 -m-2 text-gray-400 hover:text-accent rounded-full hover:bg-blue-50 transition-colors flex-shrink-0"
                        aria-label={
                          review.isHidden
                            ? "Make review visible"
                            : "Hide review"
                        }
                      >
                        {review.isHidden ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">No reviews yet.</p>
          )}

          {/* Review Form */}
          <div className="mt-10">
            {isAuthenticated ? (
              <form
                onSubmit={handleSubmitReview}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Leave a Review
                </h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewReviewRating(star)}
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        <StarIcon
                          filled={star <= (hoverRating || newReviewRating)}
                          className="w-7 h-7"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            ) : (
              <div className="text-center bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-accent font-medium hover:underline"
                  >
                    log in
                  </Link>{" "}
                  to leave a review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
