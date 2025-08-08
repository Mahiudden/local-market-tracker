import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getProductById, getProductPriceHistory, getProductReviews, addProductReview, updateProductReview, deleteProductReview, createWatchlist, getUserWatchlist, createCheckoutSession } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt, FaUserCircle, FaCheckCircle, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
// import { Head } from 'react-head'; // এই লাইন মুছে ফেললাম

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
      .catch(() => { setReviewError('রিভিউ লোড করা যায়নি'); setReviewLoading(false); });
  }, [id]);

  // Watchlist চেক
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
      Swal.fire('অনুমতি নেই', 'শুধুমাত্র সাধারণ ইউজাররা রিভিউ দিতে পারে', 'warning');
      return;
    }
    if (!newRating) return Swal.fire('রেটিং দিন', 'রেটিং দিতে হবে', 'info');
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
      Swal.fire('সফল!', 'রিভিউ যোগ হয়েছে', 'success');
    } catch {
      Swal.fire('ত্রুটি', 'রিভিউ যোগ করা যায়নি', 'error');
    }
    setSubmitting(false);
  };

  // Edit Review Submit
  const handleEditReview = async (idx) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপডেট করতে চান?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, আপডেট করুন',
      cancelButtonText: 'বাতিল',
    });
    if (!result.isConfirmed) return;
    setEditLoading(true);
    try {
      await updateProductReview(id, idx, { userUid: user.uid, comment: editComment, rating: editRating });
      setReviews(r => r.map((rv, i) => i === idx ? { ...rv, comment: editComment, rating: editRating, updatedAt: new Date() } : rv));
      setEditIdx(null);
      Swal.fire('সফল!', 'রিভিউ আপডেট হয়েছে', 'success');
    } catch {
      Swal.fire('ত্রুটি', 'রিভিউ আপডেট করা যায়নি', 'error');
    }
    setEditLoading(false);
  };
  // Delete Review
  const handleDeleteReview = async (idx) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'রিভিউ ডিলিট করতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, ডিলিট করুন',
      cancelButtonText: 'বাতিল',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProductReview(id, idx, { userUid: user.uid });
      setReviews(r => r.filter((_, i) => i !== idx));
      Swal.fire('সফল!', 'রিভিউ ডিলিট হয়েছে', 'success');
    } catch {
      Swal.fire('ত্রুটি', 'রিভিউ ডিলিট করা যায়নি', 'error');
    }
  };

  const handleAddWatchlist = async () => {
    if (!user) return Swal.fire('লগইন করুন', 'ওয়াচলিস্টে যোগ করতে হলে লগইন করতে হবে', 'info');
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
      Swal.fire('সফল!', 'ওয়াচলিস্টে যোগ হয়েছে', 'success');
    } catch {
      Swal.fire('ত্রুটি', 'ওয়াচলিস্টে যোগ করা যায়নি', 'error');
    }
    setWatchlistLoading(false);
  };

  const handleBuy = async () => {
    if (!user) return Swal.fire('লগইন করুন', 'কিনতে হলে লগইন করতে হবে', 'info');
    if (!product) return;
    // প্রয়োজনীয় তথ্য চেক
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
      Swal.fire('ত্রুটি', 'প্রোডাক্টের তথ্য সঠিকভাবে পাওয়া যায়নি! দয়া করে পেজটি রিফ্রেশ করুন বা অন্য প্রোডাক্ট ট্রাই করুন।', 'error');
      return;
    }
    try {
      const res = await createCheckoutSession(payload);
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        Swal.fire('ত্রুটি', 'Stripe checkout শুরু করা যায়নি', 'error');
      }
    } catch (err) {
      Swal.fire('ত্রুটি', err?.response?.data?.message || 'Stripe checkout শুরু করা যায়নি', 'error');
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;
  const minBuyPrice = 60; // নিরাপদ মিনিমাম (এক্সচেঞ্জ রেটের জন্য)

  // ট্রেন্ড ডেটা সিরিয়াল (পুরাতন থেকে নতুন) অর্ডার করব
  const sortedTrend = [...trend].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) return <div className="text-center py-10 text-blue-500">লোড হচ্ছে...</div>;
  if (error || !product) return <div className="text-center py-10 text-red-500">{error || 'Product not found'}</div>;

  return (
    <>
      <title>{product?.name ? `${product.name} | Local Market Tracker` : 'Product Details | Local Market Tracker'}</title>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← ফিরে যান</button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            className="rounded-3xl shadow-2xl bg-white overflow-hidden border-2 border-blue-100"
          >
            {/* Hero Section */}
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
              {/* Info Section */}
              <div className="md:w-1/2 p-8 flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">{product.name}</h2>
                  <div className="text-lg font-semibold text-green-700 mb-2">বর্তমান দাম: <span className="text-2xl">৳{product.pricePerUnit}</span></div>
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
                      {inWatchlist ? 'ওয়াচলিস্টে আছে' : watchlistLoading ? 'যোগ হচ্ছে...' : 'ওয়াচলিস্টে যোগ করুন'}
                    </button>
                  )}
                  <div className="flex flex-col">
                    <button
                      className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition text-white px-4 py-2 rounded shadow font-bold flex items-center gap-1 ${role === 'admin' || role === 'vendor' || product.pricePerUnit < minBuyPrice ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={handleBuy}
                      disabled={role === 'admin' || role === 'vendor' || product.pricePerUnit < minBuyPrice}
                    >
                      <span>🛒</span> কিনুন
                    </button>
                    {product.pricePerUnit < minBuyPrice && (
                      <span className="text-xs text-red-500 mt-1">কমপক্ষে {minBuyPrice} টাকা হলে কিনতে পারবেন</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-2 text-blue-700">দামের ট্রেন্ড</div>
                  <div className="w-full h-40 bg-blue-50 rounded flex items-center justify-center">
                    {trendLoading ? (
                      <span className="text-blue-400">লোড হচ্ছে...</span>
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
                      <span className="text-blue-400">কোনো ডেটা নেই</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Review & Vendor Section */}
            <div className="p-8 border-t border-blue-100 bg-blue-50">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">রিভিউ ও রেটিং
                    {avgRating && <span className="flex items-center gap-1 text-base text-yellow-500">{avgRating}<FaStar /></span>}
                    {reviews.length > 0 && <span className="text-xs text-gray-500">({reviews.length} রিভিউ)</span>}
                  </div>
                  <div className="space-y-3">
                    {reviewLoading ? <div className="text-blue-400">লোড হচ্ছে...</div> :
                      reviewError ? <div className="text-red-500">{reviewError}</div> :
                      reviews.length === 0 ? <div className="text-gray-400">কোনো রিভিউ নেই</div> :
                      reviews.map((r, i) => (
                        <div key={i} className="mb-3 p-2 bg-white rounded shadow-sm">
                          <div className="font-bold text-gray-700 flex items-center gap-2">{r.userName} <span className="text-yellow-500 flex">{[...Array(r.rating)].map((_,i)=><FaStar key={i} />)}</span></div>
                          <div className="text-xs text-gray-500">{r.email}</div>
                          <div className="text-sm">{r.comment}</div>
                          <div className="text-xs text-gray-400">
                            {r.updatedAt ? `আপডেটেড: ${new Date(r.updatedAt).toLocaleString()}` : r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                          </div>
                          {user && r.userUid === user.uid && (
                            <div className="flex gap-2 mt-1">
                              <button className="text-blue-500 hover:underline text-xs" onClick={() => { setEditIdx(i); setEditComment(r.comment); setEditRating(r.rating); }}>এডিট</button>
                              <button className="text-red-500 hover:underline text-xs" onClick={() => handleDeleteReview(i)}>ডিলিট</button>
                            </div>
                          )}
                          {editIdx === i && (
                            <form className="mt-2 flex flex-col gap-2 bg-blue-50 p-2 rounded" onSubmit={e => { e.preventDefault(); handleEditReview(i); }}>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-700">রেটিং:</span>
                                {[1,2,3,4,5].map(star => (
                                  <button type="button" key={star} onClick={()=>setEditRating(star)}>
                                    <FaStar className={star <= editRating ? 'text-yellow-500' : 'text-gray-300'} />
                                  </button>
                                ))}
                              </div>
                              <textarea value={editComment} onChange={e=>setEditComment(e.target.value)} className="border px-2 py-1 rounded" rows={2} />
                              <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" disabled={editLoading}>{editLoading ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}</button>
                                <button type="button" className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition" onClick={()=>setEditIdx(null)}>বাতিল</button>
                              </div>
                            </form>
                          )}
                        </div>
                      ))}
                  </div>
                  {user ? (
                    <form className="mt-4 flex flex-col gap-2" onSubmit={handleReviewSubmit}>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">রেটিং দিন:</span>
                        {[1,2,3,4,5].map(star => (
                          <button type="button" key={star} onClick={()=>setNewRating(star)}>
                            <FaStar className={star <= newRating ? 'text-yellow-500' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} className="border px-2 py-1 rounded" placeholder="আপনার মন্তব্য" rows={2} />
                      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" disabled={submitting}>{submitting ? 'পাঠানো হচ্ছে...' : 'পাঠান'}</button>
                    </form>
                  ) : (
                    <div className="text-blue-500 mt-4">রিভিউ দিতে লগইন করুন</div>
                  )}
                </div>
                <div className="w-full md:w-64 mt-8 md:mt-0">
                  <div className="bg-white border border-blue-100 rounded-lg p-4 mb-6 shadow-sm">
                    <div className="font-semibold text-blue-700 mb-1">বিক্রেতা তথ্য</div>
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