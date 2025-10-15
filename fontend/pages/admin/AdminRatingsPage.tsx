import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartEvent } from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import * as api from '../../utils/api';
import { StarRating } from '../../components/StarRating';
import { Link } from 'react-router-dom';
import { Review, Product } from '../../types';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ReviewWithProductInfo extends Review {
    productName: string;
    productId: number;
    productImage: string;
}

export const AdminRatingsPage: React.FC = () => {
    const [reviews, setReviews] = useState<ReviewWithProductInfo[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [productFilter, setProductFilter] = useState<string>('all');
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
    const chartRef = useRef<ChartJS<'bar'>>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [reviewsData, productsData] = await Promise.all([
                    api.getAdminReviews(),
                    api.getProducts()
                ]);
                setReviews(reviewsData);
                setProducts(productsData);
            } catch (err) {
                setError("Failed to load ratings data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredReviews = useMemo(() => {
        return reviews.filter(review => {
            const productMatch = productFilter === 'all' || review.productId.toString() === productFilter;
            const ratingMatch = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
            const visibilityMatch = visibilityFilter === 'all' || (visibilityFilter === 'visible' && !review.isHidden) || (visibilityFilter === 'hidden' && review.isHidden);
            return productMatch && ratingMatch && visibilityMatch;
        });
    }, [reviews, productFilter, ratingFilter, visibilityFilter]);

    const ratingsDistribution = useMemo(() => {
        const source = productFilter === 'all' ? reviews : reviews.filter(r => r.productId.toString() === productFilter);
        const counts = [0, 0, 0, 0, 0];
        source.forEach(review => { counts[review.rating - 1]++; });
        return counts;
    }, [reviews, productFilter]);

    const chartData = {
        labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
        datasets: [{ label: '# of Reviews', data: ratingsDistribution, backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: 'rgb(59, 130, 246)', borderWidth: 1 }],
    };

    const chartOptions: any = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

    const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!chartRef.current) return;
        const element = getElementAtEvent(chartRef.current, event);
        if (element.length > 0) {
            setRatingFilter(prev => prev === (element[0].index + 1).toString() ? 'all' : (element[0].index + 1).toString());
        }
    };

    const handleToggleVisibility = async (productId: number, reviewId: number) => {
        try {
            const updatedReview = await api.toggleAdminReviewVisibility(productId, reviewId);
            setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isHidden: updatedReview.isHidden } : r));
        } catch (err) {
            alert("Failed to toggle review visibility.");
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Ratings & Reviews</h1>
            {loading ? <div className="flex justify-center"><Spinner/></div> : error ? <p className="text-red-500">{error}</p> :
            <>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 h-80">
                    <Bar ref={chartRef} options={chartOptions} data={chartData} onClick={handleChartClick} />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="product-filter" className="block text-sm font-medium text-gray-700">Product</label>
                            <select id="product-filter" value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="mt-1 block w-full input-field">
                                <option value="all">All</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700">Rating</label>
                            <select id="rating-filter" value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="mt-1 block w-full input-field">
                                <option value="all">All</option>{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="visibility-filter" className="block text-sm font-medium text-gray-700">Status</label>
                            <select id="visibility-filter" value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value as any)} className="mt-1 block w-full input-field">
                                <option value="all">All</option><option value="visible">Visible</option><option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="th-cell">Product</th><th className="th-cell">Rating</th>
                                    <th className="th-cell">Comment</th><th className="th-cell">Author</th>
                                    <th className="th-cell">Date</th><th className="th-cell">Status</th>
                                    <th className="th-cell text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredReviews.map(review => (
                                    <tr key={review.id} className={`${review.isHidden ? 'bg-yellow-50/50' : ''}`}>
                                        <td className="px-6 py-4"><Link to={`/products/${review.productId}`} className="flex items-center group"><img src={review.productImage} alt={review.productName} className="w-10 h-10 rounded-md object-cover mr-4" /><span className="text-sm font-medium text-gray-900 group-hover:text-accent">{review.productName}</span></Link></td>
                                        <td className="px-6 py-4"><StarRating rating={review.rating} /></td>
                                        <td className="px-6 py-4"><p className="text-sm text-gray-600 max-w-sm whitespace-pre-wrap">{review.comment}</p></td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{review.author}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${review.isHidden ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{review.isHidden ? 'Hidden' : 'Visible'}</span></td>
                                        <td className="px-6 py-4 text-right text-sm font-medium"><Button variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => handleToggleVisibility(review.productId, review.id)}>Toggle</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredReviews.length === 0 && <div className="text-center py-8 text-gray-500">No reviews match filters.</div>}
                    </div>
                </div>
            </>
            }
            <style>{`.input-field { pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md } .th-cell { px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider }`}</style>
        </div>
    );
};
