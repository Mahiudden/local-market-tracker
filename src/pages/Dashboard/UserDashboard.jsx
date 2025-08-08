import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getProductPriceHistory, getUserWatchlist, getUserOrders, deleteWatchlist, requestVendor, getApprovedProducts } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import Swal from 'sweetalert2';

const dummyTrends = [
  { date: 'Apr 1', price: 55 },
  { date: 'Apr 3', price: 65 },
  { date: 'Apr 5', price: 70 },
  { date: 'Apr 7', price: 62 },
];

const watchlist = [
  { id: 1, name: 'Carrot', market: 'Green Market', date: '2024-04-07' },
  { id: 2, name: 'Potato', market: 'Green Market', date: '2024-04-07' },
];

const orders = [
  { id: 1, name: 'Carrot', market: 'Green Market', price: 70, date: '2024-04-07' },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('trends');
  const [myWatchlist, setMyWatchlist] = useState(watchlist);
  const [selectedProduct, setSelectedProduct] = useState(watchlist[0]?._id || '');
  const [trendData, setTrendData] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchlistError, setWatchlistError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [vendorRequestStatus, setVendorRequestStatus] = useState(user?.vendorRequest || 'none');
  const [vendorRequestLoading, setVendorRequestLoading] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorReason, setVendorReason] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  // সব approved products আনব
  useEffect(() => {
    getApprovedProducts()
      .then(res => setAllProducts(res.data || []));
  }, []);

  // ডিফল্ট সিলেক্টেড প্রোডাক্ট
  useEffect(() => {
    if (allProducts.length && !selectedProduct) {
      setSelectedProduct(allProducts[0]._id);
    }
  }, [allProducts, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    setLoadingTrend(true);
    getProductPriceHistory(selectedProduct)
      .then(res => {
        setTrendData(res.data);
        setLoadingTrend(false);
      })
      .catch(() => {
        setTrendData([]);
        setLoadingTrend(false);
      });
  }, [selectedProduct]);

  // Fetch watchlist from API
  useEffect(() => {
    if (!user?.uid) return;
    setWatchlistLoading(true);
    getUserWatchlist(user.uid)
      .then(res => {
        setMyWatchlist(res.data);
        setWatchlistLoading(false);
      })
      .catch(() => {
        setWatchlistError('ওয়াচলিস্ট লোড করা যায়নি');
        setWatchlistLoading(false);
      });
  }, [user?.uid]);

  // Fetch orders from API
  useEffect(() => {
    if (!user?.uid) return;
    setOrdersLoading(true);
    getUserOrders(user.uid)
      .then(res => {
        setOrders(res.data);
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrdersError('অর্ডার লোড করা যায়নি');
        setOrdersLoading(false);
      });
  }, [user?.uid]);

  // ইউজার অবজেক্ট আপডেট হলে vendorRequestStatus আপডেট
  useEffect(() => {
    setVendorRequestStatus(user?.vendorRequest || 'none');
  }, [user]);

  const handleVendorRequest = async (e) => {
    e.preventDefault();
    setVendorRequestLoading(true);
    try {
      await requestVendor(user.uid);
      setVendorRequestStatus('pending');
      setShowVendorForm(false);
      toast.success('আপনার আবেদন এডমিনের কাছে পাঠানো হয়েছে!');
    } catch {
      toast.error('আবেদন পাঠাতে সমস্যা হয়েছে!');
    }
    setVendorRequestLoading(false);
  };

  // Remove from watchlist
  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই আইটেমটি ওয়াচলিস্ট থেকে মুছে যাবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'বাতিল',
    });
    if (result.isConfirmed) {
      try {
        await deleteWatchlist(id);
        setMyWatchlist(myWatchlist.filter(item => item._id !== id));
        toast.success('ওয়াচলিস্ট থেকে মুছে ফেলা হয়েছে!');
      } catch {
        toast.error('ওয়াচলিস্ট থেকে মুছতে সমস্যা হয়েছে!');
      }
    }
  };

  // টেবিলের Remove বাটনের জন্য কনফার্মেশন ও Toastify
  const handleRemoveWithConfirm = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'আপনি কি নিশ্চিতভাবে এই আইটেমটি ওয়াচলিস্ট থেকে মুছে ফেলতে চান?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন',
      cancelButtonText: 'বাতিল',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteWatchlist(id);
      setMyWatchlist(myWatchlist.filter(item => item._id !== id));
      toast.success('ওয়াচলিস্ট থেকে মুছে ফেলা হয়েছে!');
    } catch {
      toast.error('ওয়াচলিস্ট থেকে মুছতে সমস্যা হয়েছে!');
    }
  };

  // Trend % হিসাব
  const getTrendPercent = () => {
    if (!trendData || trendData.length < 2) return null;
    const last = trendData[trendData.length - 1].price;
    // ৭ দিন আগের দাম খুঁজে বের করুন (বা প্রথম পয়েন্ট)
    let prev = trendData[0].price;
    if (trendData.length >= 7) prev = trendData[trendData.length - 7].price;
    if (prev === 0) return null;
    const percent = ((last - prev) / prev) * 100;
    return percent.toFixed(1);
  };

  // Trend ডেটা sort করে দেখাবো (পুরাতন থেকে নতুন)
  const sortedTrendData = [...trendData].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Vendor Request Link & Status */}
      {user?.role === 'user' && (
        <div className="mb-6 flex flex-col items-center justify-center">
          {vendorRequestStatus === 'none' && !showVendorForm && (
            <button onClick={() => setShowVendorForm(true)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded shadow transition">ভেন্ডর হওয়ার জন্য আবেদন করুন</button>
          )}
          {showVendorForm && (
            <form onSubmit={handleVendorRequest} className="bg-white rounded-xl shadow p-6 mt-4 flex flex-col gap-4 w-full max-w-md">
              <h3 className="text-lg font-bold text-blue-700 mb-2">ভেন্ডর হওয়ার জন্য আবেদন ফর্ম</h3>
              <div>
                <label className="block text-gray-700 mb-1">আপনার নাম</label>
                <input type="text" value={user?.name || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">ইমেইল</label>
                <input type="email" value={user?.email || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              {/* ভবিষ্যতে কারণ/মেসেজ চাইলে এখানে যুক্ত করা যাবে */}
              <div className="flex gap-2 mt-2">
                <button type="submit" disabled={vendorRequestLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded transition">{vendorRequestLoading ? 'পাঠানো হচ্ছে...' : 'আবেদন পাঠান'}</button>
                <button type="button" onClick={() => setShowVendorForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-4 py-2 rounded transition">বাতিল</button>
              </div>
            </form>
          )}
          {vendorRequestStatus === 'pending' && (
            <div className="text-yellow-600 font-semibold mt-2">আপনার আবেদন এডমিনের অনুমোদনের জন্য অপেক্ষমাণ...</div>
          )}
          {vendorRequestStatus === 'accepted' && (
            <div className="text-green-600 font-semibold mt-2">আপনি এখন একজন ভেন্ডর!</div>
          )}
          {vendorRequestStatus === 'rejected' && (
            <div className="text-red-600 font-semibold mt-2">আপনার আবেদনটি এডমিন দ্বারা বাতিল হয়েছে।</div>
          )}
        </div>
      )}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('trends')} className={`px-4 py-2 rounded ${activeTab === 'trends' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>📊 View Price Trends</button>
        <button onClick={() => setActiveTab('watchlist')} className={`px-4 py-2 rounded ${activeTab === 'watchlist' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>🛠️ Manage Watchlist</button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>🛒 My Order List</button>
      </div>

      {/* Price Trends */}
      {activeTab === 'trends' && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <h2 className="text-xl font-bold flex-shrink-0">Price Trend</h2>
            <select
              className="border rounded px-2 py-1 min-w-[220px]"
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              disabled={allProducts.length === 0}
            >
              {allProducts.length === 0 ? (
                <option value="">কোনো প্রোডাক্ট নেই</option>
              ) : (
                allProducts.map(item => (
                  <option key={item._id} value={item._id}>{item.name} - {item.marketName}</option>
                ))
              )}
            </select>
          </div>
          {loadingTrend ? (
            <div className="flex flex-col items-center justify-center py-10 text-blue-500">
              <span className="text-2xl animate-spin">⏳</span>
              <span>লোড হচ্ছে...</span>
            </div>
          ) : trendData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <span className="text-4xl mb-2">📉</span>
              <span>কোনো ডেটা নেই</span>
            </div>
          ) : (
            <>
              {/* প্রোডাক্ট ইনফো */}
              {allProducts.length > 0 && (
                <div className="mb-4 flex flex-col sm:flex-row items-center gap-4 bg-blue-50 rounded p-4 border border-blue-200">
                  <div className="font-bold text-blue-700 text-2xl flex items-center gap-2">
                    <span role="img" aria-label="product">🥕</span>
                    {allProducts.find(item => item._id === selectedProduct)?.name || ''}
                  </div>
                  <div className="text-base text-gray-700 font-semibold">Market: <span className="text-blue-800">{allProducts.find(item => item._id === selectedProduct)?.marketName || ''}</span></div>
                  <div className="text-base text-gray-700 font-semibold">Vendor: <span className="text-blue-800">{allProducts.find(item => item._id === selectedProduct)?.vendorName || 'N/A'}</span></div>
                  <div className="text-xs text-gray-500">Date: {allProducts.find(item => item._id === selectedProduct)?.date || ''}</div>
                </div>
              )}
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sortedTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
              {/* Trend % */}
              <div className="mt-4 text-lg font-semibold flex items-center gap-2">
                Trend:
                {getTrendPercent() !== null ? (
                  <span className={Number(getTrendPercent()) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Number(getTrendPercent()) >= 0 ? '+' : ''}{getTrendPercent()}% last 7 days
                  </span>
                ) : (
                  <span className="text-gray-500">ডেটা অপর্যাপ্ত</span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Watchlist</h2>
          {watchlistLoading ? (
            <div>লোড হচ্ছে...</div>
          ) : watchlistError ? (
            <div className="text-red-500">{watchlistError}</div>
          ) : myWatchlist.length === 0 ? (
            <div className="text-gray-500">কোনো আইটেম নেই</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">🥕 Product Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">🏪 Market Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">📅 Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">➕ Add More</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">❌ Remove</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myWatchlist.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-2">{item.productName || item.name}</td>
                      <td className="px-4 py-2">{item.marketName || item.market}</td>
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => navigate('/products')}
                        >
                          Add More
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                          onClick={() => handleRemoveWithConfirm(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Order List */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">My Orders</h2>
          {ordersLoading ? (
            <div>লোড হচ্ছে...</div>
          ) : ordersError ? (
            <div className="text-red-500">{ordersError}</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500">কোনো অর্ডার নেই</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">🥕 Product Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">🏪 Market Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">💰 Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">📅 Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">🔍 View Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, i) => (
                    <tr key={order._id || order.stripeSessionId || order.productId || i}>
                      <td className="px-4 py-2">{order.productName || 'Unknown Product'}</td>
                      <td className="px-4 py-2">{order.marketName || '-'}</td>
                      <td className="px-4 py-2">৳{order.price || '-'}</td>
                      <td className="px-4 py-2">{order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-')}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => navigate(`/product/${order.productId}`)}
                        >
                          বিস্তারিত
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
} 