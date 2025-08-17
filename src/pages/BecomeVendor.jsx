import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestVendor } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function BecomeVendor() {
  const { user } = useAuth();
  const [vendorRequestStatus, setVendorRequestStatus] = useState(user?.vendorRequest || 'none');
  const [vendorRequestLoading, setVendorRequestLoading] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(true);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    setVendorRequestStatus(user?.vendorRequest || 'none');
    setName(user?.displayName || user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleVendorRequest = async (e) => {
    e.preventDefault();
    setError('');
    if (!reason.trim()) {
      setError('Write the reason for your application');
      return;
    }
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Login to apply to become a vendor</h2>
          <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded transition">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-10 px-4">
              <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">Apply to become a vendor</h2>
        <p className="text-gray-600 text-center mb-8">Provide your information and write why you want to become a vendor. The admin will review and make a decision.</p>
        {vendorRequestStatus === 'none' && showVendorForm && (
          <form onSubmit={handleVendorRequest} className="flex flex-col gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Your name <span className="text-red-500">*</span></label>
              <input type="text" value={name} disabled className="w-full border-2 border-blue-200 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" value={email} disabled className="w-full border-2 border-blue-200 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Reason for application <span className="text-red-500">*</span></label>
              <textarea
                className="w-full border-2 border-blue-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition min-h-[90px] resize-none"
                placeholder="Briefly write why you want to become a vendor..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
              />
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>
            <button
              type="submit"
              disabled={vendorRequestLoading}
              className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-lg disabled:opacity-60"
            >
              {vendorRequestLoading ? 'Sending...' : 'Submit Application'}
            </button>
          </form>
        )}
        {vendorRequestStatus === 'pending' && (
          <div className="text-yellow-600 font-semibold mt-2 text-center text-lg">Your application is pending for admin approval...</div>
        )}
        {vendorRequestStatus === 'accepted' && (
          <div className="text-green-600 font-semibold mt-2 text-center text-lg">You are now a vendor!</div>
        )}
        {vendorRequestStatus === 'rejected' && (
          <div className="text-red-600 font-semibold mt-2 text-center text-lg">Your application has been rejected by the admin.</div>
        )}
      </div>
    </div>
  );
}