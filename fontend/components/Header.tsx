import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);

export const Header: React.FC = () => {
  const { cartCount, wishlistCount, state } = useStore();
  const { isAuthenticated, isAdmin } = state.auth;

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 w-full border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
              Zenith
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors">Home</Link>
              <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-accent transition-colors">All Products</Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-accent hover:text-blue-600 transition-colors">Admin</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={isAuthenticated ? "/profile" : "/login"} className="text-gray-500 hover:text-accent transition-colors">
              <UserIcon />
            </Link>
            <Link to="/wishlist" className="relative text-gray-500 hover:text-accent transition-colors">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-accent text-white text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-gray-500 hover:text-accent transition-colors">
              <ShoppingBagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-accent text-white text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};