import { User, CartItem, Product } from '../types';

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isAdmin: boolean;
}

export interface CartState {
    items: CartItem[];
}

export interface WishlistState {
    items: Product[];
}

export interface AppState {
    auth: AuthState;
    cart: CartState;
    wishlist: WishlistState;
}

export const initialState: AppState = {
    auth: {
        isAuthenticated: false,
        user: null,
        isAdmin: false,
    },
    cart: {
        items: [],
    },
    wishlist: {
        items: [],
    }
};
