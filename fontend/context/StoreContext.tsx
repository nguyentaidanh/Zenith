import React, { createContext, useReducer, useContext, ReactNode, useMemo, useEffect } from 'react';
import { appReducer } from '../store/reducer';
import { initialState, AppState } from '../store/state';
import { Action } from '../store/actions';
import { User } from '../types';
import * as api from '../utils/api';

interface StoreContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    // Derived state
    cartCount: number;
    cartTotal: number;
    wishlistCount: number;
    isInWishlist: (productId: number) => boolean;
    // Async actions
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone: string) => Promise<void>;
    logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        const checkUserSession = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const { user } = await api.getCurrentUser();
                    if (user) {
                        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
                    }
                } catch (error) {
                    console.error("Session check failed, logging out.", error);
                    localStorage.removeItem('authToken');
                }
            }
        };
        checkUserSession();
    }, []);


    const login = async (email: string, password: string): Promise<void> => {
        const { token, user } = await api.login(email, password);
        localStorage.setItem('authToken', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    };

    const register = async (name: string, email: string, password: string, phone: string): Promise<void> => {
        const { token, user } = await api.register(name, email, password, phone);
        localStorage.setItem('authToken', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        dispatch({ type: 'LOGOUT' });
    };

    // Derived state calculations
    const cartCount = useMemo(() => state.cart.items.reduce((count, item) => count + item.quantity, 0), [state.cart.items]);
    const cartTotal = useMemo(() => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0), [state.cart.items]);
    const wishlistCount = useMemo(() => state.wishlist.items.length, [state.wishlist.items]);
    
    const isInWishlist = (productId: number): boolean => {
        return state.wishlist.items.some(item => item.id === productId);
    };

    const value: StoreContextType = {
        state,
        dispatch,
        cartCount,
        cartTotal,
        wishlistCount,
        isInWishlist,
        login,
        register,
        logout,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = (): StoreContextType => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
