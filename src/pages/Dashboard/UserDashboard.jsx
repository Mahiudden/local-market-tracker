import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getProductPriceHistory, getUserWatchlist, getUserOrders, deleteWatchlist, requestVendor, getApprovedProducts } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2';
import OverviewPage from './OverviewPage';

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
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    getApprovedProducts()
      .then(res => setAllProducts(res.data || []));
  }, []);

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

  useEffect(() => {
    if (!user?.uid) return;
    setWatchlistLoading(true);
    getUserWatchlist(user.uid)
      .then(res => {
        setMyWatchlist(res.data);
        setWatchlistLoading(false);
      })
      .catch(() => {
        setWatchlistError('Could not load watchlist');
        setWatchlistLoading(false);
      });
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    setOrdersLoading(true);
    getUserOrders(user.uid)
      .then(res => {
        setOrders(res.data);
        setOrdersLoading(false);
      })
      .catch(() => {
        setOrdersError('Could not load orders');
        setOrdersLoading(false);
      });
  }, [user?.uid]);

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
      toast.success('Your application has been sent to the admin!');
    } catch {
      toast.error('There was a problem sending the application!');
    }
    setVendorRequestLoading(false);
  };

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: 'Confirm',
      text: 'Do you want to remove this item from the watchlist?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      try {
        await deleteWatchlist(id);
        setMyWatchlist(prev => prev.filter(item => item._id !== id));
        toast.success('Removed from watchlist!');
      } catch {
        toast.error('There was a problem removing!');
      }
    }
  };

  const getTrendPercent = () => {
    if (trendData.length < 2) return null;
    const sorted = [...trendData].sort((a, b) => new Date(a.date) - new Date(b.date));
    const first = sorted[0].price;
    const last = sorted[sorted.length - 1].price;
    return (((last - first) / first) * 100).toFixed(1);
  };

  const sortedTrendData = [...trendData].sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'trends':
        return (
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
                  <option value="">No products</option>
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
                <span>Loading...</span>
              </div>
            ) : trendData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <span className="text-4xl mb-2">📉</span>
                <span>No data</span>
              </div>
            ) : (
              <>
                {allProducts.length > 0 && (
                  <div className="mb-4 flex flex-col sm:flex-row items-center gap-4 bg-blue-50 rounded p-4 border border-blue-200">
                    <div className="font-bold text-blue-700 text-2xl flex items-center gap-2">
                      <span role="img" aria-label="product">🥕</span>
                      {allProducts.find(item => item._id === selectedProduct)?.name || ''}
                    </div>
                    <div className="text-base text-gray-700 font-semibold">Market: <span className="text-blue-800">{allProducts.find(item => item._id === selectedProduct)?.marketName || ''}</span></div>
                    <div className="font-semibold">Vendor: <span className="text-blue-800">{allProducts.find(item => item._id === selectedProduct)?.vendorName || 'N/A'}</span></div>
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
                <div className="mt-4 text-lg font-semibold flex items-center gap-2">
                  Trend:
                  {getTrendPercent() !== null ? (
                    <span className={Number(getTrendPercent()) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Number(getTrendPercent()) >= 0 ? '+' : ''}{getTrendPercent()}% last 7 days
                    </span>
                  ) : (
                    <span className="text-gray-500">Insufficient data</span>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 'watchlist':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Watchlist</h2>
            {watchlistLoading ? (
              <div>Loading...</div>
            ) : watchlistError ? (
              <div className="text-red-500">{watchlistError}</div>
            ) : myWatchlist.length === 0 ? (
              <div className="text-gray-500">No items</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myWatchlist.map((item, i) => (
                      <tr key={item._id || item.id || i}>
                        <td className="px-4 py-2">{item.productName || item.name}</td>
                        <td className="px-4 py-2">{item.marketName || item.market}</td>
                        <td className="px-4 py-2">{item.date}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                              onClick={() => navigate(`/product/${item.productId || item.id}`)}
                            >
                              View
                            </button>
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                              onClick={() => handleRemove(item._id || item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Order List</h2>
            {ordersLoading ? (
              <div>Loading...</div>
            ) : ordersError ? (
              <div className="text-red-500">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="text-gray-500">No orders</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
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
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {user?.role === 'user' && (
        <div className="mb-6 flex flex-col items-center justify-center">
          {vendorRequestStatus === 'none' && !showVendorForm && (
            <button onClick={() => setShowVendorForm(true)} className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded shadow transition">Apply to become a vendor</button>
          )}
          {showVendorForm && (
            <form onSubmit={handleVendorRequest} className="bg-white rounded-xl shadow p-6 mt-4 flex flex-col gap-4 w-full max-w-md">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Application form to become a vendor</h3>
              <div>
                <label className="block text-gray-700 mb-1">Your name</label>
                <input type="text" value={user?.name || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" disabled={vendorRequestLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded transition">{vendorRequestLoading ? 'Sending...' : 'Send Application'}</button>
                <button type="button" onClick={() => setShowVendorForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-4 py-2 rounded transition">Cancel</button>
              </div>
            </form>
          )}
          {vendorRequestStatus === 'pending' && (
            <div className="text-yellow-600 font-semibold mt-2">Your application is pending for admin approval...</div>
          )}
          {vendorRequestStatus === 'accepted' && (
            <div className="text-green-600 font-semibold mt-2">You are now a vendor!</div>
          )}
          {vendorRequestStatus === 'rejected' && (
            <div className="text-red-600 font-semibold mt-2">Your application has been rejected by the admin.</div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'overview' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaChartLine />
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('trends')} 
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'trends' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaChartLine />
          Price Trend
        </button>
        <button 
          onClick={() => setActiveTab('watchlist')} 
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'watchlist' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaStore />
          Watchlist
        </button>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'orders' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaMoneyBillWave />
          Orders
        </button>
      </div>

      {renderTabContent()}

      <ToastContainer position="top-right" />
    </div>
  );
}