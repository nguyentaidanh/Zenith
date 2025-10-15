import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

export const WishlistPage: React.FC = () => {
  const { state } = useStore();
  const { items: wishlist } = state.wishlist;

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">My Wishlist</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Your favorite items, saved for later.
            </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Your wishlist is empty.</p>
            <Link to="/products">
                <Button className="mt-6">Discover Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};