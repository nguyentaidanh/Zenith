export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isHidden?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., 'Color', 'Size'
  options: string[]; // e.g., ['Red', 'Blue'], ['S', 'M', 'L']
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number; // Selling Price
  costPrice: number; // Import/Cost Price
  description: string;
  images: string[];
  variants: ProductVariant[];
  reviews: Review[];
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: { [key: string]: string };
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  customerName: string;
  customerEmail: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  orders: Order[];
  role: 'customer' | 'admin';
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}