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
    if (orderSaved) return; // একবারই চলবে
    const saveOrder = async (user) => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      if (!sessionId) {
        setError('Session ID পাওয়া যায়নি');
        setSaving(false);
        Swal.fire('ত্রুটি', 'Session ID পাওয়া যায়নি', 'error');
        return;
      }
      try {
        // প্রথমে sessionId দিয়ে অর্ডার আছে কিনা চেক করো
        let existingOrder = null;
        try {
          const res = await getOrderBySessionId(sessionId);
          existingOrder = res.data;
        } catch (err) {
          // 404 হলে কিছু করব না, অন্য error হলে দেখাবো
          if (err.response && err.response.status !== 404) {
            throw err;
          }
        }
        if (existingOrder) {
          setOrderSaved(true);
          setSaving(false);
          Swal.fire({
            icon: 'success',
            title: 'অর্ডার ইতিমধ্যে আছে!',
            text: 'আপনার অর্ডার কনফার্ম হয়েছে।',
            confirmButtonText: 'ঠিক আছে',
          }).then(() => {
            navigate('/dashboard/user');
          });
          return;
        }
        // Stripe session details আনুন
        const res = await axios.get(`${API_BASE}/checkout/session-details?session_id=${sessionId}`);
        const session = res.data;
        // অর্ডার ডেটা তৈরি করুন
        const orderData = {
          userUid: user?.uid || session.metadata?.userUid || '',
          productId: session.metadata?.productId || '',
          productName: session.metadata?.productName || '',
          marketName: session.metadata?.marketName || '',
          price: session.metadata?.price || '',
          date: session.metadata?.date || '',
          status: 'completed',
          sessionId: session.id // নতুন ফিল্ড
        };
        await createOrder(orderData);
        setOrderSaved(true);
        setSaving(false);
        Swal.fire({
          icon: 'success',
          title: 'অর্ডার সফল!',
          text: 'আপনার অর্ডার কনফার্ম হয়েছে।',
          confirmButtonText: 'ঠিক আছে',
        }).then(() => {
          navigate('/dashboard/user');
        });
      } catch (err) {
        setError('অর্ডার সেভ করা যায়নি');
        setSaving(false);
        Swal.fire('ত্রুটি', 'অর্ডার সেভ করা যায়নি', 'error');
        console.error('Order save error:', err);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setError('অর্ডার সেভ করতে হলে লগইন থাকতে হবে');
        setSaving(false);
        Swal.fire('ত্রুটি', 'অর্ডার সেভ করতে হলে লগইন থাকতে হবে', 'error');
        return;
      }
      saveOrder(user);
      unsubscribe();
    });
    // eslint-disable-next-line
  }, [location.search, orderSaved]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">✅ পেমেন্ট সফল!</h1>
      {saving ? (
        <p className="text-lg text-gray-700 mb-6">অর্ডার সেভ হচ্ছে...</p>
      ) : error ? (
        <p className="text-lg text-red-600 mb-6">{error}</p>
      ) : (
        <p className="text-lg text-gray-700 mb-6">আপনার অর্ডার কনফার্ম হয়েছে।</p>
      )}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        onClick={() => navigate('/dashboard')}
      >
        ড্যাশবোর্ডে যান
      </button>
    </div>
  );
};

export default PaymentSuccess; 