import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import * as api from '../utils/api';
import { Spinner } from '../components/Spinner';

export const ProductListPage: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('default');
  const [selectedVariantFilters, setSelectedVariantFilters] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await api.getProducts();
        setAllProducts(products);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(allProducts.map(p => p.category))], [allProducts]);

  const availableVariantFilters = useMemo(() => {
    const variantMap = allProducts.reduce((acc, product) => {
      product.variants.forEach(variant => {
        if (!acc[variant.name]) {
          acc[variant.name] = new Set<string>();
        }
        variant.options.forEach(option => acc[variant.name].add(option));
      });
      return acc;
    }, {} as Record<string, Set<string>>);

    return Object.entries(variantMap).map(([name, optionsSet]) => ({
        name,
        options: Array.from(optionsSet).sort(),
    }));
  }, [allProducts]);

  const handleVariantFilterChange = (variantName: string, option: string) => {
    setSelectedVariantFilters(prev => {
        const newFilters = { ...prev };
        if (newFilters[variantName] === option) {
            delete newFilters[variantName];
        } else {
            newFilters[variantName] = option;
        }
        return newFilters;
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products: Product[] = [...allProducts];

    if (filterCategory !== 'All') {
      products = products.filter(p => p.category === filterCategory);
    }

    const activeVariantFilters = Object.entries(selectedVariantFilters);
    if (activeVariantFilters.length > 0) {
        products = products.filter(product => {
            return activeVariantFilters.every(([variantName, selectedOption]) => {
                const productVariant = product.variants.find(v => v.name === variantName);
                return productVariant ? productVariant.options.includes(selectedOption) : false;
            });
        });
    }

    if (searchTerm) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        products = products.filter(product =>
            product.name.toLowerCase().includes(lowercasedSearchTerm) ||
            product.description.toLowerCase().includes(lowercasedSearchTerm)
        );
    }

    switch (sortOption) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return products;
  }, [allProducts, filterCategory, sortOption, selectedVariantFilters, searchTerm]);

  const renderContent = () => {
    if (loading) {
      return <div className="col-span-full flex justify-center py-24"><Spinner /></div>;
    }

    if (error) {
      return <div className="col-span-full text-center py-24 text-red-600">{error}</div>;
    }

    return filteredAndSortedProducts.length > 0 ? (
      filteredAndSortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))
    ) : (
      <div className="col-span-full text-center py-12">
        <p className="text-lg text-gray-500">No products found matching your criteria.</p>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Our Collection</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                Browse through our carefully selected products.
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-24">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Categories</h2>
                <ul className="space-y-2 border-b border-gray-200 pb-6">
                {categories.map(category => (
                    <li key={category}>
                    <button
                        onClick={() => setFilterCategory(category)}
                        className={`text-left w-full text-sm ${filterCategory === category ? 'text-accent font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        {category}
                    </button>
                    </li>
                ))}
                </ul>
                
                {availableVariantFilters.map(variant => (
                    <div key={variant.name} className="mt-6 border-b border-gray-200 pb-6">
                         <h3 className="text-md font-semibold mb-4 text-gray-900">{variant.name}</h3>
                         <ul className="space-y-2">
                             {variant.options.map(option => (
                                <li key={option}>
                                    <button
                                        onClick={() => handleVariantFilterChange(variant.name, option)}
                                        className={`text-left w-full text-sm flex items-center ${selectedVariantFilters[variant.name] === option ? 'text-accent font-bold' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        <span className={`w-4 h-4 rounded-full border border-gray-300 mr-2 flex-shrink-0 ${selectedVariantFilters[variant.name] === option ? 'bg-accent border-accent' : ''}`}></span>
                                        {option}
                                    </button>
                                </li>
                             ))}
                         </ul>
                    </div>
                ))}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full sm:w-1/2 lg:w-2/3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                    />
                </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
              >
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
