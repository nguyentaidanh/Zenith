import { Order, Product, Review, User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BE_URL ?? "/api";

// const API_BASE_URL = "/api";

const getToken = (): string | null => localStorage.getItem("authToken");

// A generic fetcher function with proper error handling and typing.
const fetcher = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  console.log("fetch:", `${API_BASE_URL}${url}`);
  console.log("options:", JSON.stringify(options));
  console.log("headers:", JSON.stringify(headers));
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Request failed with status ${response.status}`,
      }));
      throw new Error(errorData.message || "An unknown API error occurred");
    }

    if (response.status === 204) {
      return null as T;
    }

    return response.json();
  } catch (error) {
    console.error(`API call to ${url} failed:`, error);
    throw error;
  }
};

// --- AUTH ---
interface AuthResponse {
  token: string;
  user: User;
}
export const login = (email: string, password: string): Promise<AuthResponse> =>
  fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const register = (
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<AuthResponse> =>
  fetcher("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
export const getCurrentUser = (): Promise<{ user: User }> =>
  fetcher("/auth/me");

// --- PRODUCTS ---
export const getProducts = (params?: URLSearchParams): Promise<Product[]> =>
  fetcher(`/products?${params?.toString() || ""}`);
export const getProductById = (id: string): Promise<Product> =>
  fetcher(`/products/${id}`);
export const createProduct = (
  productData: Partial<Product>
): Promise<Product> =>
  fetcher("/products", { method: "POST", body: JSON.stringify(productData) });
export const updateProduct = (
  id: string,
  productData: Partial<Product>
): Promise<Product> =>
  fetcher(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
export const deleteProduct = (id: number): Promise<void> =>
  fetcher(`/products/${id}`, { method: "DELETE" });

// --- REVIEWS ---
export const addProductReview = (
  productId: number,
  reviewData: Omit<Review, "id" | "date" | "isHidden">
): Promise<Review> =>
  fetcher(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

// --- ORDERS ---
export const createOrder = (orderData: any): Promise<Order> =>
  fetcher("/orders", { method: "POST", body: JSON.stringify(orderData) });
export const getUserOrders = (): Promise<Order[]> =>
  fetcher("/orders/my-orders");

// --- ADMIN ---
interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}
export const getAdminStats = (): Promise<AdminStats> => fetcher("/admin/stats");
export const getAdminOrders = (): Promise<Order[]> => fetcher("/admin/orders");
export const getAdminUsers = (): Promise<User[]> => fetcher("/admin/users");
export const getAdminReviews = (): Promise<
  (Review & { productName: string; productId: number; productImage: string })[]
> => fetcher("/admin/reviews");
export const updateOrderStatus = (
  orderId: string,
  status: Order["status"]
): Promise<Order> =>
  fetcher(`/admin/orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
export const toggleAdminReviewVisibility = (
  productId: number,
  reviewId: number
): Promise<Review> =>
  fetcher(`/admin/reviews/toggle`, {
    method: "POST",
    body: JSON.stringify({ productId, reviewId }),
  });
export const resetUserPassword = (userId: number): Promise<void> =>
  fetcher(`/admin/users/${userId}/reset-password`, { method: "POST" });
