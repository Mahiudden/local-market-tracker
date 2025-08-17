import axios from 'axios';
import { getAuth } from 'firebase/auth';

export const API_BASE = 'https://backend-xi-seven-28.vercel.app/api';
// export const API_BASE= 'http://localhost:5000/api';

// Request deduplication cache
const pendingRequests = new Map();

// Helper function to deduplicate requests
const deduplicateRequest = (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
};

// Axios interceptor: প্রতিটি রিকোয়েস্টে Firebase ID Token পাঠাবে
axios.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Axios response interceptor for network error retry
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry only on network errors (not 429 since we removed rate limiting)
    if (error.code === 'ERR_NETWORK' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Simple retry with 2 second delay
      console.log('Retrying request due to network error');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return axios(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Product APIs
export const getAllProducts = () => axios.get(`${API_BASE}/products`);
export const getProductById = (id) => axios.get(`${API_BASE}/products/${id}`);
export const createProduct = (product) => axios.post(`${API_BASE}/products`, product);
export const updateProduct = (id, product) => axios.put(`${API_BASE}/products/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${API_BASE}/products/${id}`);
export const getProductPriceHistory = (id) => axios.get(`${API_BASE}/products/${id}/prices`);
export const getVendorProducts = (uid) => axios.get(`${API_BASE}/products/vendor/${uid}`);
export const getProductReviews = (id) => axios.get(`${API_BASE}/products/${id}/reviews`);
export const addProductReview = (id, review) => axios.post(`${API_BASE}/products/${id}/reviews`, review);
export const updateProductReview = (productId, reviewIdx, data) => axios.put(`${API_BASE}/products/${productId}/reviews/${reviewIdx}`, data);
export const deleteProductReview = (productId, reviewIdx, data) => axios.delete(`${API_BASE}/products/${productId}/reviews/${reviewIdx}`, { data });
export const getApprovedProducts = () => axios.get(`${API_BASE}/products/approved`);

// Advertisement APIs
export const getAllAds = () => axios.get(`${API_BASE}/advertisements`);
export const getAdById = (id) => axios.get(`${API_BASE}/advertisements/${id}`);
export const createAd = (ad) => axios.post(`${API_BASE}/advertisements`, ad);
export const updateAd = (id, ad) => axios.put(`${API_BASE}/advertisements/${id}`, ad);
export const deleteAd = (id) => axios.delete(`${API_BASE}/advertisements/${id}`);
export const getApprovedAds = () => axios.get(`${API_BASE}/advertisements/approved`);

// Order APIs
export const getAllOrders = () => axios.get(`${API_BASE}/orders`);
export const getOrderById = (id) => axios.get(`${API_BASE}/orders/${id}`);
export const createOrder = (order) => axios.post(`${API_BASE}/orders`, order);
export const updateOrder = (id, order) => axios.put(`${API_BASE}/orders/${id}`, order);
export const deleteOrder = (id) => axios.delete(`${API_BASE}/orders/${id}`);
export const getOrderBySessionId = (sessionId) => axios.get(`${API_BASE}/orders/session/${sessionId}`);

// Watchlist APIs
export const getAllWatchlist = () => axios.get(`${API_BASE}/watchlist`);
export const getWatchlistById = (id) => axios.get(`${API_BASE}/watchlist/${id}`);
export const createWatchlist = (item) => axios.post(`${API_BASE}/watchlist`, item);
export const deleteWatchlist = (id) => axios.delete(`${API_BASE}/watchlist/${id}`);

// User Sync (Firebase user to MongoDB)
export const syncUser = (user) => axios.post(`${API_BASE}/users/sync`, user);

// Get user by uid (with deduplication)
export const getUserByUid = (uid) => {
  const key = `getUserByUid:${uid}`;
  return deduplicateRequest(key, () => axios.get(`${API_BASE}/users/uid/${uid}`));
};

// Update user profile
export const updateUserProfile = (profileData) => axios.put(`${API_BASE}/users/profile/update`, profileData);


// Change user password
export const changePassword = (newPassword) => axios.post(`${API_BASE}/users/change-password`, { newPassword });

// User APIs
export const getAllUsers = () => axios.get(`${API_BASE}/users`);
export const updateUser = (id, data) => axios.put(`${API_BASE}/users/${id}`, data);

// Example usage:
// import { getAllProducts, createProduct, syncUser, getAllAds, createAd, getAllOrders, createOrder, getAllWatchlist, createWatchlist } from '../utils/api';
// getAllProducts().then(res => console.log(res.data));
// createProduct(productObj).then(res => ...);
// syncUser(firebaseUserObj).then(res => ...);

export const getUserWatchlist = (uid) => axios.get(`${API_BASE}/watchlist/user/${uid}`);
export const getUserOrders = (uid) => axios.get(`${API_BASE}/orders/user/${uid}`);
export const createCheckoutSession = (data) => axios.post(`${API_BASE}/checkout/create-checkout-session`, data);
export const requestVendor = (uid) => axios.post(`${API_BASE}/users/request-vendor`, { uid });
export const getPendingVendorRequests = () => axios.get(`${API_BASE}/users/vendor-requests`);
export const respondVendorRequest = (id, action) => axios.post(`${API_BASE}/users/vendor-requests/${id}`, { action });
export const requestAdmin = (uid) => axios.post(`${API_BASE}/users/request-admin`, { uid });
export const getPendingAdminRequests = () => axios.get(`${API_BASE}/users/admin-requests`);
export const respondAdminRequest = (id, action) => axios.post(`${API_BASE}/users/admin-requests/${id}`, { action }); 