import { AppState, AuthState, CartState, WishlistState } from './state';
import { Action } from './actions';
import { CartItem } from '../types';

const authReducer = (state: AuthState, action: Action): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                isAdmin: action.payload.role === 'admin',
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                isAdmin: false,
            };
        default:
            return state;
    }
};

const cartReducer = (state: CartState, action: Action): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const { product, quantity, selectedVariant } = action.payload;
            const existingItemIndex = state.items.findIndex(item => item.id === product.id);
            let newItems;
            if (existingItemIndex > -1) {
                newItems = [...state.items];
                newItems[existingItemIndex].quantity += quantity;
            } else {
                newItems = [...state.items, { ...product, quantity, selectedVariant }];
            }
            return { ...state, items: newItems };
        }
        case 'REMOVE_FROM_CART': {
            const newItems = state.items.filter(item => item.id !== action.payload.productId);
            return { ...state, items: newItems };
        }
        case 'UPDATE_CART_QUANTITY': {
            const { productId, quantity } = action.payload;
            if (quantity <= 0) {
                 const newItems = state.items.filter(item => item.id !== productId);
                 return { ...state, items: newItems };
            }
            const newItems = state.items.map(item =>
                item.id === productId ? { ...item, quantity } : item
            );
            return { ...state, items: newItems };
        }
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

const wishlistReducer = (state: WishlistState, action: Action): WishlistState => {
     switch (action.type) {
        case 'ADD_TO_WISHLIST': {
            if (state.items.some(item => item.id === action.payload.id)) {
                return state;
            }
            return { ...state, items: [...state.items, action.payload] };
        }
        case 'REMOVE_FROM_WISHLIST': {
            const newItems = state.items.filter(item => item.id !== action.payload.productId);
            return { ...state, items: newItems };
        }
        default:
            return state;
    }
};


export const appReducer = (state: AppState, action: Action): AppState => {
    return {
        auth: authReducer(state.auth, action),
        cart: cartReducer(state.cart, action),
        wishlist: wishlistReducer(state.wishlist, action),
    };
};
