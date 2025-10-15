import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { Button } from '../../components/Button';
import * as api from '../../utils/api';
import { Spinner } from '../../components/Spinner';

export const AdminProductEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isNew = !id;

    const [product, setProduct] = useState<Partial<Product>>({
        name: '', category: '', price: 0, costPrice: 0,
        description: '', stock: 0, images: [''], variants: [],
    });
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew && id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const existingProduct = await api.getProductById(id);
                    setProduct(existingProduct);
                } catch (err) {
                    setError('Failed to load product data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isNew]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' || name === 'costPrice' ? Number(value) : value }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...(product.images || [])];
        newImages[index] = value;
        setProduct(prev => ({ ...prev, images: newImages }));
    };

    const handleAddImage = () => setProduct(prev => ({ ...prev, images: [...(prev.images || []), ''] }));
    const handleRemoveImage = (index: number) => setProduct(prev => ({ ...prev, images: (prev.images || []).filter((_, i) => i !== index) }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (isNew) {
                await api.createProduct(product);
            } else if(id) {
                await api.updateProduct(id, product);
            }
            alert(`Product ${isNew ? 'created' : 'updated'} successfully!`);
            navigate('/admin/products');
        } catch (err: any) {
            setError(err.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isNew) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input type="text" name="name" id="name" value={product.name} onChange={handleChange} className="mt-1 block w-full input-field" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="category">Category</label>
                            <input type="text" name="category" id="category" value={product.category} onChange={handleChange} className="mt-1 block w-full input-field" required />
                        </div>
                         <div>
                            <label htmlFor="price">Selling Price</label>
                            <input type="number" name="price" id="price" value={product.price} onChange={handleChange} className="mt-1 block w-full input-field" required step="0.01" />
                        </div>
                         <div>
                            <label htmlFor="costPrice">Cost Price</label>
                            <input type="number" name="costPrice" id="costPrice" value={product.costPrice} onChange={handleChange} className="mt-1 block w-full input-field" required step="0.01" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="stock">Stock Quantity</label>
                        <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full input-field" required />
                    </div>
                     <div>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={4} className="mt-1 block w-full input-field" required></textarea>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                        <div className="mt-4 space-y-4">
                            {(product.images || []).map((image, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <input type="text" value={image} onChange={(e) => handleImageChange(index, e.target.value)} placeholder="Enter image URL" className="flex-grow input-field"/>
                                    <Button type="button" variant="danger" onClick={() => handleRemoveImage(index)}>Remove</Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="secondary" onClick={handleAddImage} className="mt-4">Add Image</Button>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                         <Button type="button" variant="secondary" onClick={() => navigate('/admin/products')}>Cancel</Button>
                         <Button type="submit" disabled={loading}>{loading ? <Spinner/> : (isNew ? 'Create Product' : 'Save Changes')}</Button>
                    </div>
                </form>
            </div>
            <style>{`.input-field { border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .input-field:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 1px #3b82f6; }`}</style>
        </div>
    );
};
