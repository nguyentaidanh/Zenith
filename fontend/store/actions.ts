import { User, Product } from '../types';

export type Action =
    | { type: 'LOGIN_SUCCESS'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'ADD_TO_CART'; payload: { product: Product, quantity: number, selectedVariant: { [key: string]: string } } }
    | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
    | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: number, quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'ADD_TO_WISHLIST'; payload: Product }
    | { type: 'REMOVE_FROM_WISHLIST'; payload: { productId: number } };
