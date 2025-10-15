import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import * as api from '../utils/api';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const allProducts = await api.getProducts();
        setFeaturedProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <img src="https://picsum.photos/id/119/1920/1080" alt="Background" className="w-full h-full object-center object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Curated for a Modern Life
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
                Discover our collection of high-quality products, designed with purpose and style.
            </p>
            <Link
                to="/products"
                className="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-primary hover:bg-gray-100 transition-colors"
            >
                Shop Collection
            </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl text-center">Featured Products</h2>
          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center"><Spinner /></div>
            ) : (
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
