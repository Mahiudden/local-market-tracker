import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllProducts, getAllAds, getAllOrders, updateUser, updateProduct, updateAd, getPendingVendorRequests, respondVendorRequest, getPendingAdminRequests, respondAdminRequest, deleteProduct, deleteAd } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AllUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, newRole: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  useEffect(() => {
    getAllUsers()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('ডেটা লোড করা যায়নি');
        setLoading(false);
      });
  }, []);

  const handleRoleChange = (id, newRole) => {
    setConfirm({ open: true, id, newRole });
  };
  const confirmRoleChange = async () => {
    try {
      await updateUser(confirm.id, { role: confirm.newRole });
      setUsers(users => users.map(u => u._id === confirm.id ? { ...u, role: confirm.newRole } : u));
      toast.success('রোল আপডেট হয়েছে!');
    } catch {
      toast.error('রোল আপডেট করতে সমস্যা হয়েছে');
    }
    setConfirm({ open: false, id: null, newRole: '' });
  };

  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // সার্চ ফিল্টার
  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pagedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">সব ইউজার</h2>
      <input
        type="text"
        placeholder="নাম বা ইমেইল দিয়ে সার্চ করুন..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {/* মোবাইলে কার্ড ভিউ, বড় স্ক্রিনে টেবিল */}
      <div className="block sm:hidden space-y-3">
        {pagedUsers.map(user => (
          <div key={user._id} className="bg-white border rounded-xl shadow px-4 py-3 mb-2 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-500 text-lg"><svg xmlns='http://www.w3.org/2000/svg' className='inline' width='18' height='18' fill='none' viewBox='0 0 24 24'><path fill='currentColor' d='M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v2c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-2c0-3.3-6.7-5-10-5Z'/></svg></span>
              <span className="font-bold text-base">{user.name || '-'}</span>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${user.role==='admin' ? 'bg-blue-100 text-blue-700' : user.role==='vendor' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{user.role || 'user'}</span>
            </div>
            <div className="text-xs text-gray-600 break-all"><span className="font-semibold">ইমেইল:</span> {user.email}</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs">রোল:</span>
              <select
                value={user.role || 'user'}
                onChange={e => handleRoleChange(user._id, e.target.value)}
                className="border rounded-lg px-2 py-1 text-xs w-full bg-gray-50"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="vendor">vendor</option>
              </select>
            </div>
            <div className="text-xs text-gray-500 break-all"><span className="font-semibold">UID:</span> {user.uid}</div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">রোল</th>
              <th className="px-2 sm:px-4 py-2 text-left font-medium text-gray-500 uppercase">UID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagedUsers.map(user => (
              <tr key={user._id}>
                <td className="px-2 sm:px-4 py-2">{user.name || '-'}</td>
                <td className="px-2 sm:px-4 py-2">{user.email}</td>
                <td className="px-2 sm:px-4 py-2">
                  <select
                    value={user.role || 'user'}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className="border rounded px-2 py-1 bg-gray-50"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="vendor">vendor</option>
                  </select>
                </td>
                <td className="px-2 sm:px-4 py-2 break-all">{user.uid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-center items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 bg-white rounded shadow border font-bold text-gray-700">{page} / {totalPages || 1}</span>
        <button
          onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {confirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4 text-blue-700">রোল পরিবর্তন নিশ্চিত করুন</h3>
            <p className="mb-4">আপনি কি নিশ্চিতভাবে রোল পরিবর্তন করতে চান?</p>
            <div className="flex gap-4 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirm({ open: false, id: null, newRole: '' })}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={confirmRoleChange}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}
function AllProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, newStatus: '' });
  useEffect(() => {
    getAllProducts()
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => { setError('ডেটা লোড করা যায়নি'); setLoading(false); });
  }, []);
  const handleStatusChange = (id, newStatus) => {
    setConfirm({ open: true, id, newStatus });
  };
  const confirmStatusChange = async () => {
    try {
      await updateProduct(confirm.id, { status: confirm.newStatus });
      setProducts(ps => ps.map(p => p._id === confirm.id ? { ...p, status: confirm.newStatus } : p));
      toast.success('স্ট্যাটাস আপডেট হয়েছে!');
    } catch {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
    setConfirm({ open: false, id: null, newStatus: '' });
  };
  const handleStatusButton = async (id, status) => {
    if (status === 'rejected') {
      const { value: formValues, isConfirmed } = await Swal.fire({
        title: 'আপনি কি রিজেক্ট করতে চান?',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="রিজেক্টের কারণ (Reason) লিখুন">' +
          '<textarea id="swal-input2" class="swal2-textarea" placeholder="ফিডব্যাক লিখুন (ভেন্ডরের জন্য)"></textarea>',
        focusConfirm: false,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'রিজেক্ট করুন',
        cancelButtonText: 'বাতিল',
        preConfirm: () => {
          const reason = document.getElementById('swal-input1').value;
          const feedback = document.getElementById('swal-input2').value;
          if (!reason || !feedback) {
            Swal.showValidationMessage('দুইটি ফিল্ডই পূরণ করতে হবে!');
            return false;
          }
          return { reason, feedback };
        }
      });
      if (!isConfirmed || !formValues) return;
      try {
        await updateProduct(id, { status: 'rejected', reason: formValues.reason, feedback: formValues.feedback });
        setProducts(ps => ps.map(p => p._id === id ? { ...p, status: 'rejected', reason: formValues.reason, feedback: formValues.feedback } : p));
        toast.success('প্রোডাক্ট রিজেক্ট হয়েছে এবং ফিডব্যাক পাঠানো হয়েছে!');
      } catch {
        toast.error('রিজেক্ট করতে সমস্যা হয়েছে');
      }
      return;
    }
    if (status === 'pending') {
      const result = await Swal.fire({
        title: 'আপনি কি Pending করতে চান?',
        text: 'স্ট্যাটাস Pending করা হবে!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, Pending করুন',
        cancelButtonText: 'না',
      });
      if (!result.isConfirmed) return;
    }
    if (status === 'approved') {
      const result = await Swal.fire({
        title: 'আপনি কি Approve করতে চান?',
        text: 'স্ট্যাটাস Approved করা হবে!',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, Approve করুন',
        cancelButtonText: 'না',
      });
      if (!result.isConfirmed) return;
    }
    try {
      await updateProduct(id, { status });
      setProducts(ps => ps.map(p => p._id === id ? { ...p, status } : p));
      toast.success(`Status set to ${status}!`);
    } catch {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };
  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">সব প্রোডাক্ট</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">মার্কেট</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ভেন্ডর</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">দাম</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">স্ট্যাটাস</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">তারিখ</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">রিজেক্ট তথ্য</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p._id}>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.marketName}</td>
                <td className="px-4 py-2">{p.vendorName || p.vendorUid}</td>
                <td className="px-4 py-2">৳{p.pricePerUnit}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    <button onClick={() => handleStatusButton(p._id, 'pending')} className={`px-2 py-1 rounded ${p.status==='pending' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-yellow-500`}>Pending</button>
                    <button onClick={() => handleStatusButton(p._id, 'approved')} className={`px-2 py-1 rounded ${p.status==='approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-green-600`}>Approved</button>
                    <button onClick={() => handleStatusButton(p._id, 'rejected')} className={`px-2 py-1 rounded ${p.status==='rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-red-600`}>Reject</button>
                  </div>
                </td>
                <td className="px-4 py-2">{p.date}</td>
                <td className="px-4 py-2">
                  {p.status === 'rejected' && (
                    <div className="flex flex-col gap-1 items-start">
                      {p.reason && <RejectInfoBox color="bg-red-100 text-red-800 border-red-200">রিজেক্টের কারণ: {p.reason}</RejectInfoBox>}
                      {p.feedback && <RejectInfoBox color="bg-yellow-100 text-yellow-800 border-yellow-200">ফিডব্যাক: {p.feedback}</RejectInfoBox>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      {confirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4 text-blue-700">স্ট্যাটাস পরিবর্তন নিশ্চিত করুন</h3>
            <p className="mb-4">আপনি কি নিশ্চিতভাবে স্ট্যাটাস পরিবর্তন করতে চান?</p>
            <div className="flex gap-4 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirm({ open: false, id: null, newStatus: '' })}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={confirmStatusChange}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AllAdsTable() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, newStatus: '' });
  useEffect(() => {
    getAllAds()
      .then(res => { setAds(res.data); setLoading(false); })
      .catch(() => { setError('ডেটা লোড করা যায়নি'); setLoading(false); });
  }, []);
  const handleStatusChange = (id, newStatus) => {
    setConfirm({ open: true, id, newStatus });
  };
  const confirmStatusChange = async () => {
    try {
      await updateAd(confirm.id, { status: confirm.newStatus });
      setAds(as => as.map(a => a._id === confirm.id ? { ...a, status: confirm.newStatus } : a));
      toast.success('স্ট্যাটাস আপডেট হয়েছে!');
    } catch {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
    setConfirm({ open: false, id: null, newStatus: '' });
  };
  const handleAdStatusButton = async (id, status) => {
    if (status === 'rejected') {
      const { value: rejectReason } = await Swal.fire({
        title: 'আপনি কি রিজেক্ট করতে চান?',
        text: 'রিজেক্ট করলে একটি কারণ লিখতে হবে!',
        input: 'text',
        inputLabel: 'রিজেক্ট করার কারণ লিখুন',
        inputPlaceholder: 'কারণ লিখুন...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'পরবর্তী',
        cancelButtonText: 'না',
        inputValidator: (value) => {
          if (!value) {
            return 'কারণ লিখতে হবে!';
          }
          return null;
        }
      });
      if (!rejectReason) return;
      // এবার ফিডব্যাক ইনপুট
      const { value: adminFeedback } = await Swal.fire({
        title: 'ফিডব্যাক দিন',
        text: 'ভেন্ডরের জন্য ফিডব্যাক লিখুন (ঐচ্ছিক)',
        input: 'textarea',
        inputLabel: 'ফিডব্যাক',
        inputPlaceholder: 'ফিডব্যাক লিখুন...',
        showCancelButton: true,
        confirmButtonText: 'রিজেক্ট করুন',
        cancelButtonText: 'বাতিল',
      });
      if (adminFeedback === undefined) return; // cancel করলে
      try {
        await updateAd(id, { status: 'rejected', rejectReason, adminFeedback });
        setAds(as => as.map(a => a._id === id ? { ...a, status: 'rejected', rejectReason, adminFeedback } : a));
        toast.success('বিজ্ঞাপন রিজেক্ট হয়েছে!');
      } catch {
        toast.error('রিজেক্ট করতে সমস্যা হয়েছে');
      }
      return;
    }
    if (status === 'pending') {
      const result = await Swal.fire({
        title: 'আপনি কি Pending করতে চান?',
        text: 'স্ট্যাটাস Pending করা হবে!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, Pending করুন',
        cancelButtonText: 'না',
      });
      if (!result.isConfirmed) return;
    }
    if (status === 'approved') {
      const result = await Swal.fire({
        title: 'আপনি কি Approve করতে চান?',
        text: 'স্ট্যাটাস Approved করা হবে!',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'হ্যাঁ, Approve করুন',
        cancelButtonText: 'না',
      });
      if (!result.isConfirmed) return;
      try {
        await updateAd(id, { status: 'approved', rejectReason: '', adminFeedback: '' });
        setAds(as => as.map(a => a._id === id ? { ...a, status: 'approved', rejectReason: '', adminFeedback: '' } : a));
        toast.success('Status set to approved!');
      } catch {
        toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
      }
      return;
    }
    try {
      await updateAd(id, { status });
      setAds(as => as.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Status set to ${status}!`);
    } catch {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };
  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">সব বিজ্ঞাপন</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reject Reason</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Admin Feedback</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ads.map(ad => (
            <tr key={ad._id}>
              <td className="px-4 py-2">{ad.title}</td>
              <td className="px-4 py-2">{ad.desc || ad.description}</td>
              <td className="px-4 py-2">
                <div className="flex gap-1">
                  <button onClick={() => handleAdStatusButton(ad._id, 'pending')} className={`px-2 py-1 rounded ${ad.status==='pending' ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-yellow-500`}>Pending</button>
                  <button onClick={() => handleAdStatusButton(ad._id, 'approved')} className={`px-2 py-1 rounded ${ad.status==='approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-green-600`}>Approved</button>
                  <button onClick={() => handleAdStatusButton(ad._id, 'rejected')} className={`px-2 py-1 rounded ${ad.status==='rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'} hover:bg-red-600`}>Reject</button>
                </div>
              </td>
              <td className="px-4 py-2">{ad.rejectReason ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">{ad.rejectReason}</span> : '-'}</td>
              <td className="px-4 py-2">{ad.adminFeedback ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{ad.adminFeedback}</span> : '-'}</td>
              <td className="px-4 py-2">{ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {confirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4 text-blue-700">স্ট্যাটাস পরিবর্তন নিশ্চিত করুন</h3>
            <p className="mb-4">আপনি কি নিশ্চিতভাবে স্ট্যাটাস পরিবর্তন করতে চান?</p>
            <div className="flex gap-4 justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirm({ open: false, id: null, newStatus: '' })}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={confirmStatusChange}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AllOrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    getAllOrders()
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { setError('ডেটা লোড করা যায়নি'); setLoading(false); });
  }, []);
  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">সব অর্ডার</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer Email/User</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order._id}>
              <td className="px-4 py-2">{order.productName || order.productId}</td>
              <td className="px-4 py-2">{order.marketName}</td>
              <td className="px-4 py-2">{order.userName || order.userUid || order.email}</td>
              <td className="px-4 py-2">৳{order.price}</td>
              <td className="px-4 py-2">{order.date}</td>
              <td className="px-4 py-2">{order.status || order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VendorRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    getPendingVendorRequests()
      .then(res => { setRequests(res.data); setLoading(false); })
      .catch(() => { setError('ডেটা লোড করা যায়নি'); setLoading(false); });
  }, []);
  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await respondVendorRequest(id, action);
      setRequests(reqs => reqs.filter(r => r._id !== id));
      toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'}!`);
    } catch {
      toast.error('Action failed!');
    }
    setActionLoading(false);
  };
  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Vendor Requests</h2>
      {requests.length === 0 ? <div className="text-gray-500">No pending requests.</div> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(r => (
              <tr key={r._id}>
                <td className="px-4 py-2">{r.name || '-'}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.uid}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button disabled={actionLoading} onClick={() => handleAction(r._id, 'accept')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Accept</button>
                  <button disabled={actionLoading} onClick={() => handleAction(r._id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    getPendingAdminRequests()
      .then(res => { setRequests(res.data); setLoading(false); })
      .catch(() => { setError('ডেটা লোড করা যায়নি'); setLoading(false); });
  }, []);
  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await respondAdminRequest(id, action);
      setRequests(reqs => reqs.filter(r => r._id !== id));
      toast.success(`Request ${action === 'accept' ? 'accepted' : 'rejected'}!`);
    } catch {
      toast.error('Action failed!');
    }
    setActionLoading(false);
  };
  if (loading) return <div>লোড হচ্ছে...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Admin Requests</h2>
      {requests.length === 0 ? <div className="text-gray-500">No pending requests.</div> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">নাম</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ইমেইল</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map(r => (
              <tr key={r._id}>
                <td className="px-4 py-2">{r.name || '-'}</td>
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.uid}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button disabled={actionLoading} onClick={() => handleAction(r._id, 'accept')} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">Accept</button>
                  <button disabled={actionLoading} onClick={() => handleAction(r._id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Helper: রিজেক্ট তথ্যের জন্য স্টাইল
const RejectInfoBox = ({ color, children }) => (
  <div className={`text-xs rounded px-2 py-1 mt-1 max-w-[200px] break-words overflow-x-auto whitespace-pre-line border ${color}`}>{children}</div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  return (
    <div className="max-w-[1400px] mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 flex flex-col md:flex-row gap-2 sm:gap-4 md:gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-56 mb-2 md:mb-0">
        <div className="flex md:flex-col flex-row overflow-x-auto md:overflow-visible gap-2 md:gap-3 bg-gray-50 rounded-xl shadow p-2 sm:p-4 h-fit md:sticky md:top-8 scrollbar-hide whitespace-nowrap">
          <button onClick={() => setActiveTab('users')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}>👥 All Users</button>
          <button onClick={() => setActiveTab('products')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}>📦 All Product</button>
          <button onClick={() => setActiveTab('ads')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'ads' ? 'bg-pink-500 text-white' : 'hover:bg-pink-100 text-gray-700'}`}>📢 All Advertisement</button>
          <button onClick={() => setActiveTab('orders')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'orders' ? 'bg-gray-700 text-white' : 'hover:bg-gray-200 text-gray-700'}`}>🧾 All Order</button>
          <button onClick={() => setActiveTab('vendorRequests')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'vendorRequests' ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-gray-700'}`}>📝 Vendor Requests</button>
          <button onClick={() => setActiveTab('adminRequests')} className={`min-w-max text-sm text-left px-2 sm:px-4 py-2 rounded font-semibold transition ${activeTab === 'adminRequests' ? 'bg-red-600 text-white' : 'hover:bg-red-100 text-gray-700'}`}>🛡️ Admin Requests</button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {activeTab === 'users' && <AllUsersTable />}
        {activeTab === 'products' && <AllProductsTable />}
        {activeTab === 'ads' && <AllAdsTable />}
        {activeTab === 'orders' && <AllOrdersTable />}
        {activeTab === 'vendorRequests' && <VendorRequestsTable />}
        {activeTab === 'adminRequests' && <AdminRequestsTable />}
      </div>
    </div>
  );
} 