import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Spinner } from "../../components/Spinner";
import { Product } from "../../types";
import * as api from "../../utils/api";

export const AdminProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        categoryFilter === "all" || product.category === categoryFilter;
      const stockMatch =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "out-of-stock" && product.stock === 0);
      const searchMatch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && stockMatch && searchMatch;
    });
  }, [products, categoryFilter, stockFilter, searchTerm]);

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.deleteProduct(productId);
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const renderTableBody = () => {
    if (loading)
      return (
        <tr>
          <td colSpan={7} className="text-center py-8">
            <Spinner />
          </td>
        </tr>
      );
    if (error)
      return (
        <tr>
          <td colSpan={7} className="text-center py-8 text-red-500">
            {error}
          </td>
        </tr>
      );
    if (filteredProducts.length === 0)
      return (
        <tr>
          <td colSpan={7} className="text-center py-8 text-gray-500">
            No products match the current filters.
          </td>
        </tr>
      );

    return filteredProducts.map((product) => {
      const profit = product.price - product.costPrice;
      const profitMargin =
        product.price > 0 ? (profit / product.price) * 100 : 0;
      return (
        <tr key={product.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 rounded-md object-cover"
            />
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {product.name}
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td> */}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${product.price}
          </td>
          {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.costPrice.toFixed(2)}</td> */}
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${product.costPrice}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {/* <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>${profit.toFixed(2)}</span> */}
            <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
              ${profit}
            </span>
            <span className="text-gray-400 text-xs ml-1">
              ({profitMargin.toFixed(1)}%)
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {product.stock}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <Link
              to={`/admin/products/edit/${product.id}`}
              className="text-accent hover:text-blue-700 mr-4"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(product.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <Link to="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Leather Watch"
              className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="mt-1 block w-full input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All" : cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="stock-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Stock Status
            </label>
            <select
              id="stock-filter"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="mt-1 block w-full input-field"
            >
              <option value="all">All</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-cell">Image</th>
                <th className="th-cell">Name</th>
                <th className="th-cell">Selling Price</th>
                <th className="th-cell">Cost Price</th>
                <th className="th-cell">Profit</th>
                <th className="th-cell">Stock</th>
                <th className="th-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`.input-field { pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md } .th-cell { px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider }`}</style>
    </div>
  );
};
