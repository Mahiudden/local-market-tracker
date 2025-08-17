import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getProductById, getProductPriceHistory, getProductReviews, addProductReview, updateProductReview, deleteProductReview, createWatchlist, getUserWatchlist, createCheckoutSession } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt, FaUserCircle, FaCheckCircle, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';

const badgeColors = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { role } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editLoading, setEditLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Product not found');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setTrendLoading(true);
    getProductPriceHistory(id)
      .then(res => {
        setTrend(res.data);
        setTrendLoading(false);
      })
      .catch(() => setTrendLoading(false));
  }, [id]);

  useEffect(() => {
    setReviewLoading(true);
    getProductReviews(id)
      .then(res => { setReviews(res.data); setReviewLoading(false); })
      .catch(() => { setReviewError('Could not load reviews'); setReviewLoading(false); });
  }, [id]);

  useEffect(() => {
    if (role !== 'user' || !user?.uid || !id) {
      setInWatchlist(false);
      return;
    }
    setWatchlistLoading(true);
    getUserWatchlist(user.uid)
      .then(res => {
        setInWatchlist(res.data.some(item => item.productId === id));
        setWatchlistLoading(false);
      })
      .catch(() => setWatchlistLoading(false));
  }, [role, user?.uid, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (role !== 'user') {
      Swal.fire('Permission denied', 'Only general users can give reviews', 'warning');
      return;
    }
    if (!newRating) return Swal.fire('Give a rating', 'Rating is required', 'info');
    setSubmitting(true);
    try {
      const review = {
        userName: user.displayName || 'Anonymous',
        userUid: user.uid,
        email: user.email,
        rating: newRating,
        comment: newComment
      };
      await addProductReview(id, review);
      setReviews(r => [{ ...review, createdAt: new Date() }, ...r]);
      setNewComment('');
      setNewRating(0);
      Swal.fire('Successful!', 'Review has been added', 'success');
    } catch {
      Swal.fire('Error', 'Could not add review', 'error');
    }
    setSubmitting(false);
  };

  const handleEditReview = async (idx) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    setEditLoading(true);
    try {
      await updateProductReview(id, idx, { userUid: user.uid, comment: editComment, rating: editRating });
      setReviews(r => r.map((rv, i) => i === idx ? { ...rv, comment: editComment, rating: editRating, updatedAt: new Date() } : rv));
      setEditIdx(null);
      Swal.fire('Successful!', 'Review has been updated', 'success');
    } catch {
      Swal.fire('Error', 'Could not update review', 'error');
    }
    setEditLoading(false);
  };

  const handleDeleteReview = async (idx) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete the review?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProductReview(id, idx, { userUid: user.uid });
      setReviews(r => r.filter((_, i) => i !== idx));
      Swal.fire('Successful!', 'Review has been deleted', 'success');
    } catch {
      Swal.fire('Error', 'Could not delete review', 'error');
    }
  };

  const handleAddWatchlist = async () => {
    if (!user) return Swal.fire('Login', 'You must be logged in to add to watchlist', 'info');
    setWatchlistLoading(true);
    try {
      const payload = {
        userUid: user.uid,
        productId: id
      };
      if (product.name) payload.productName = product.name;
      if (product.marketName) payload.marketName = product.marketName;
      if (product.date) payload.date = product.date;
      await createWatchlist(payload);
      setInWatchlist(true);
      Swal.fire('Successful!', 'Added to watchlist', 'success');
    } catch {
      Swal.fire('Error', 'Could not add to watchlist', 'error');
    }
    setWatchlistLoading(false);
  };

  const handleBuy = async () => {
    if (!user) return Swal.fire('Login', 'You must be logged in to buy', 'info');
    if (!product) return;
    const payload = {
      productName: product.name || 'Unknown Product',
      price: product.pricePerUnit || 0,
      productId: product._id || id || 'unknown',
      userUid: user.uid,
      marketName: product.marketName || 'Unknown Market',
      date: product.date || new Date().toISOString().slice(0, 10)
    };
    console.log('Checkout Payload:', payload);
    if (!payload.productName || !payload.price || !payload.productId) {
      Swal.fire('Error', 'Product information not found correctly! Please refresh the page or try another product.', 'error');
      return;
    }
    try {
      const res = await createCheckoutSession(payload);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        Swal.fire('Error', 'Could not start Stripe checkout', 'error');
      }
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Could not start Stripe checkout', 'error');
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;
  const minBuyPrice = 60;

  const sortedTrend = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="text-center py-10 text-blue-500">Loading...</div>;
  if (error || !product) return <div className="text-center py-10 text-red-500">{error || 'Product not found'}</div>;

  return (
    <>
      <title>{product?.name ? `${product.name} | Local Market Tracker` : 'Product Details | Local Market Tracker'}</title>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Go back</button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="rounded-3xl shadow-2xl bg-white overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-yellow-50">
                <div className="w-full h-64 flex items-center justify-center overflow-hidden rounded-2xl shadow-lg mb-4 bg-gray-100">
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FaStore className="text-yellow-400 text-xl" />
                  <span className="font-bold text-blue-700 text-xl">{product.marketName}</span>
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${badgeColors[product.status]}`}>{product.status}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <FaCalendarAlt className="text-blue-300" />
                  <span>{product.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <FaUserCircle className="text-blue-400 text-lg" />
                  <span className="font-semibold text-blue-700">{product.vendorName || 'Vendor'}</span>
                  <FaCheckCircle className="text-green-400 ml-1" title="Verified" />
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">{product.name}</h2>
                  <div className="text-lg font-semibold text-green-700 mb-2">Current price: <span className="text-2xl">৳{product.pricePerUnit}</span></div>
                  <div className="text-sm text-gray-500 mb-2">{product.itemDesc}</div>
                  <div className="text-xs text-gray-400 mb-2">{product.marketDesc}</div>
                </div>
                <div className="flex gap-2 mb-2">
                  {role === 'user' && (
                    <button
                      className={`bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded shadow ${inWatchlist || watchlistLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={handleAddWatchlist}
                      disabled={inWatchlist || watchlistLoading}
                    >
                      {inWatchlist ? 'In watchlist' : watchlistLoading ? 'Adding...' : 'Add to watchlist'}
                    </button>
                  )}
                  <div className="flex flex-col">
                    <button
                      className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition text-white px-4 py-2 rounded shadow font-bold flex items-center gap-1 ${role === 'admin' || role === 'vendor' || product.pricePerUnit < minBuyPrice ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={handleBuy}
                      disabled={role === 'admin' || role === 'vendor' || product.pricePerUnit < minBuyPrice}
                    >
                      <span>🛒</span> Buy
                    </button>
                    {product.pricePerUnit < minBuyPrice && (
                      <span className="text-xs text-red-500 mt-1">You can buy if the price is at least {minBuyPrice} Taka</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2 text-blue-700">Price trend</div>
                  <div className="w-full h-40 bg-blue-50 rounded flex items-center justify-center">
                    {trendLoading ? (
                      <span className="text-blue-400">Loading...</span>
                    ) : trend && trend.length > 0 ? (
                      <ResponsiveContainer width="100%" height={140}>
                        <LineChart data={sortedTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <span className="text-blue-400">No data</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-blue-50">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">Reviews & Ratings
                    {avgRating && <span className="flex items-center gap-1 text-base text-yellow-500">{avgRating}<FaStar /></span>}
                    {reviews.length > 0 && <span className="text-xs text-gray-500">({reviews.length} review(s))</span>}
                  </div>
                  <div className="space-y-3">
                    {reviewLoading ? <div className="text-blue-400">Loading...</div> :
                      reviewError ? <div className="text-red-500">{reviewError}</div> :
                      reviews.length === 0 ? <div className="text-gray-400">No reviews</div> :
                      reviews.map((r, i) => (
                        <div key={i} className="mb-3 p-2 bg-white rounded shadow-sm">
                          <div className="font-bold text-gray-700 flex items-center gap-2">{r.userName} <span className="text-yellow-500 flex">{[...Array(r.rating)].map((_,i)=><FaStar key={i} />)}</span></div>
                          <div className="text-xs text-gray-500">{r.email}</div>
                          <div className="text-sm">{r.comment}</div>
                          <div className="text-xs text-gray-400">
                            {r.updatedAt ? `Updated: ${new Date(r.updatedAt).toLocaleString()}` : r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                          </div>
                          {user && r.userUid === user.uid && (
                            <div className="flex gap-2 mt-1">
                              <button className="text-blue-500 hover:underline text-xs" onClick={() => { setEditIdx(i); setEditComment(r.comment); setEditRating(r.rating); }}>Edit</button>
                              <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteReview(i)}>Delete</button>
                            </div>
                          )}
                          {editIdx === i && (
                            <form className="mt-2 flex flex-col gap-2 bg-blue-50 p-2 rounded" onSubmit={e => { e.preventDefault(); handleEditReview(i); }}>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-700">Rating:</span>
                                {[1,2,3,4,5].map(star => (
                                  <button type="button" key={star} onClick={()=>setEditRating(star)}>
                                    <FaStar className={star <= editRating ? 'text-yellow-500' : 'text-gray-300'} />
                                  </button>
                                ))}
                              </div>
                              <textarea value={editComment} onChange={e=>setEditComment(e.target.value)} className="border px-2 py-1 rounded" rows={2} />
                              <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" disabled={editLoading}>{editLoading ? 'Updating...' : 'Update'}</button>
                                <button type="button" className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition" onClick={()=>setEditIdx(null)}>Cancel</button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                  </div>
                  {user ? (
                    <form className="mt-4 flex flex-col gap-2" onSubmit={handleReviewSubmit}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">Give a rating:</span>
                        {[1,2,3,4,5].map(star => (
                          <button type="button" key={star} onClick={()=>setNewRating(star)}>
                            <FaStar className={star <= newRating ? 'text-yellow-500' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} className="border px-2 py-1 rounded" placeholder="Your comment" rows={2} />
                      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" disabled={submitting}>{submitting ? 'Sending...' : 'Send'}</button>
                    </form>
                  ) : (
                    <div className="text-blue-500 mt-4">Login to give a review</div>
                  )}
                </div>
                <div className="w-full md:w-64 mt-8 md:mt-0">
                  <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                    <div className="font-semibold text-blue-700 mb-1">Seller information</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-white">{product.vendorName ? product.vendorName[0] : 'V'}</div>
                      <div>
                        <div className="font-bold">{product.vendorName || 'Vendor'}</div>
                        <div className="text-xs text-gray-500">{product.vendorUid}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
