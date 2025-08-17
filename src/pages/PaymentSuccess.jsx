import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { createOrder, getOrderBySessionId } from '../utils/api';
import { API_BASE } from '../utils/api';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState(null);
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    if (orderSaved) return;
    const saveOrder = async (user) => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      if (!sessionId) {
        setError('Session ID not found');
        setSaving(false);
        Swal.fire('Error', 'Session ID not found', 'error');
        return;
      }
      try {
        let existingOrder = null;
        try {
          const res = await getOrderBySessionId(sessionId);
          existingOrder = res.data;
        } catch (err) {
          if (err.response && err.response.status !== 404) {
            throw err;
          }
        }
        if (existingOrder) {
          setOrderSaved(true);
          setSaving(false);
          Swal.fire({
            icon: 'success',
            title: 'Order already exists!',
            text: 'Your order has been confirmed.',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/dashboard/user');
          });
          return;
        }
        const res = await axios.get(`${API_BASE}/checkout/session-details?session_id=${sessionId}`);
        const session = res.data;
        const orderData = {
          userUid: user?.uid || session.metadata?.userUid || '',
          productId: session.metadata?.productId || '',
          productName: session.metadata?.productName || '',
          marketName: session.metadata?.marketName || '',
          price: session.metadata?.price || '',
          date: session.metadata?.date || '',
          status: 'completed',
          sessionId: session.id
        };
        await createOrder(orderData);
        setOrderSaved(true);
        setSaving(false);
        Swal.fire({
          icon: 'success',
          title: 'Order successful!',
          text: 'Your order has been confirmed.',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/dashboard/user');
        });
      } catch (err) {
        setError('Could not save order');
        setSaving(false);
        Swal.fire('Error', 'Could not save order', 'error');
        console.error('Order save error:', err);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError('You must be logged in to save the order');
        setSaving(false);
        Swal.fire('Error', 'You must be logged in to save the order', 'error');
        return;
      }
      saveOrder(user);
      unsubscribe();
    });
  }, [location.search, orderSaved]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment successful!</h1>
      {saving ? (
        <p className="text-lg text-gray-700 mb-6">Saving order...</p>
      ) : error ? (
        <p className="text-lg text-red-600 mb-6">{error}</p>
      ) : (
        <p className="text-lg text-gray-700 mb-6">Your order has been confirmed.</p>
      )}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        onClick={() => navigate('/dashboard')}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default PaymentSuccess;