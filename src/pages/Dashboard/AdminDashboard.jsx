import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllProducts, getAllAds, getAllOrders, updateUser, updateProduct, updateAd, getPendingVendorRequests, respondVendorRequest, getPendingAdminRequests, respondAdminRequest, deleteProduct, deleteAd } from '../../utils/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useTheme } from '../../context/ThemeContext';

function AllUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null, newRole: '' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const usersPerPage = 10;
  const { isDark } = useTheme();

  useEffect(() => {
    getAllUsers()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load data');
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
      toast.success('Role has been updated!');
    } catch {
      toast.error('There was a problem updating the role');
    }
    setConfirm({ open: false, id: null, newRole: '' });
  };

  if (loading) return <div className={isDark ? 'text-gray-300' : 'text-gray-700'}>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const filteredUsers = users.filter(user =>
    (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pagedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <div className={`rounded-xl shadow p-4 sm:p-6 overflow-x-auto transition-all duration-500 ${
      isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>All Users</h2>
      <input
        type="text"
        placeholder="Search by name or email..."
        className={`mb-4 px-3 py-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 transition ${
          isDark 
            ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-400' 
            : 'border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-300'
        }`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="block sm:hidden space-y-3">
        {pagedUsers.map(user => (
          <div key={user._id} className={`border rounded-xl shadow px-4 py-3 mb-2 flex flex-col gap-2 transition-all duration-500 ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-500 text-lg"><svg xmlns='http://www.w3.org/2000/svg' className='inline' width='18' height='18' fill='none' viewBox='0 0 24 24'><path fill='currentColor' d='M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v2c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-2c0-3.3-6.7-5-10-5Z'/></svg></span>
              <span className={`font-bold text-base ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{user.name || '-'}</span>
              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${
                user.role==='admin' 
                  ? isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : user.role==='vendor' 
                    ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700' 
                    : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>{user.role || 'user'}</span>
            </div>
            <div className={`text-xs break-all ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role:</span>
              <select
                value={user.role || 'user'}
                onChange={e => handleRoleChange(user._id, e.target.value)}
                className={`border rounded-lg px-2 py-1 text-xs w-full transition-all duration-300 ${
                  isDark 
                    ? 'border-gray-600 bg-gray-700 text-gray-100' 
                    : 'border-gray-300 bg-gray-50 text-gray-800'
                }`}
              >
                <option value="user" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>user</option>
                <option value="admin" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>admin</option>
                <option value="vendor" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>vendor</option>
              </select>
            </div>
            <div className={`text-xs break-all ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className="font-semibold">UID:</span> {user.uid}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block">
        <table className="min-w-full divide-y text-xs sm:text-sm">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-2 sm:px-4 py-2 text-left font-medium uppercase ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>Name</th>
              <th className={`px-2 sm:px-4 py-2 text-left font-medium uppercase ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>Email</th>
              <th className={`px-2 sm:px-4 py-2 text-left font-medium uppercase ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>Role</th>
              <th className={`px-2 sm:px-4 py-2 text-left font-medium uppercase ${
                isDark ? 'text-gray-300' : 'text-gray-500'
              }`}>UID</th>
            </tr>
          </thead>
          <tbody className={`divide-y transition-all duration-500 ${
            isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
          }`}>
            {pagedUsers.map(user => (
              <tr key={user._id} className={isDark ? 'text-gray-100' : 'text-gray-800'}>
                <td className="px-2 sm:px-4 py-2">{user.name || '-'}</td>
                <td className="px-2 sm:px-4 py-2">{user.email}</td>
                <td className="px-2 sm:px-4 py-2">
                  <select
                    value={user.role || 'user'}
                    onChange={e => handleRoleChange(user._id, e.target.value)}
                    className={`border rounded px-2 py-1 transition-all duration-300 ${
                      isDark 
                        ? 'border-gray-600 bg-gray-700 text-gray-100' 
                        : 'border-gray-300 bg-gray-50 text-gray-800'
                    }`}
                  >
                    <option value="user" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>user</option>
                    <option value="admin" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>admin</option>
                    <option value="vendor" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>vendor</option>
                  </select>
                </td>
                <td className="px-2 sm:px-4 py-2 break-all">{user.uid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-4 justify-center items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-3 py-1 rounded font-semibold hover:opacity-80 disabled:opacity-50 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100'
          }`}
        >
          Prev
        </button>
        <span className={`px-3 py-1 rounded shadow border font-bold transition-all duration-300 ${
          isDark 
            ? 'bg-gray-700 text-gray-200 border-gray-600' 
            : 'bg-white text-gray-700 border-gray-300'
        }`}>{page} / {totalPages || 1}</span>
        <button
          onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
          disabled={page === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded font-semibold hover:opacity-80 disabled:opacity-50 transition-all duration-300 ${
            isDark 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100'
          }`}
        >
          Next
        </button>
      </div>
      {confirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow p-6 w-full max-w-sm relative transition-all duration-500 ${
            isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Confirm role change</h3>
            <p className="mb-4">Are you sure you want to change the role?</p>
            <div className="flex gap-4 justify-end">
              <button className={`px-4 py-2 rounded transition-all duration-300 ${
                isDark ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`} onClick={() => setConfirm({ open: false, id: null, newRole: '' })}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300" onClick={confirmRoleChange}>Confirm</button>
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
      .catch(() => { setError('Could not load data'); setLoading(false); });
  }, []);
  const handleStatusChange = (id, newStatus) => {
    setConfirm({ open: true, id, newStatus });
  };
  const confirmStatusChange = async () => {
    try {
      await updateProduct(confirm.id, { status: confirm.newStatus });
      setProducts(ps => ps.map(p => p._id === confirm.id ? { ...p, status: confirm.newStatus } : p));
      toast.success('Status has been updated!');
    } catch {
      toast.error('There was a problem updating the status');
    }
    setConfirm({ open: false, id: null, newStatus: '' });
  };
  const handleStatusButton = async (id, status) => {
    if (status === 'rejected') {
      const { value: formValues, isConfirmed } = await Swal.fire({
        title: 'Do you want to reject?',
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="Write the reason for rejection">' +
          '<textarea id="swal-input2" class="swal2-textarea" placeholder="Write feedback (for the vendor)"></textarea>',
        focusConfirm: false,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const reason = document.getElementById('swal-input1').value;
          const feedback = document.getElementById('swal-input2').value;
          if (!reason || !feedback) {
            Swal.showValidationMessage('Both fields must be filled!');
            return false;
          }
          return { reason, feedback };
        }
      });
      if (!isConfirmed || !formValues) return;
      try {
        await updateProduct(id, { status: 'rejected', reason: formValues.reason, feedback: formValues.feedback });
        setProducts(ps => ps.map(p => p._id === id ? { ...p, status: 'rejected', reason: formValues.reason, feedback: formValues.feedback } : p));
        toast.success('The product has been rejected and feedback has been sent!');
      } catch {
        toast.error('There was a problem rejecting');
      }
      return;
    }
    if (status === 'pending') {
      const result = await Swal.fire({
        title: 'Do you want to set to Pending?',
        text: 'The status will be set to Pending!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, set to Pending',
        cancelButtonText: 'No',
      });
      if (!result.isConfirmed) return;
    }
    if (status === 'approved') {
      const result = await Swal.fire({
        title: 'Do you want to approve?',
        text: 'The status will be set to Approved!',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'No',
      });
      if (!result.isConfirmed) return;
    }
    try {
      await updateProduct(id, { status });
      setProducts(ps => ps.map(p => p._id === id ? { ...p, status } : p));
      toast.success(`Status set to ${status}!`);
    } catch {
      toast.error('There was a problem updating the status');
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rejection information</th>
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
                      {p.reason && <RejectInfoBox color="bg-red-100 text-red-800 border-red-200">Reason for rejection: {p.reason}</RejectInfoBox>}
                      {p.feedback && <RejectInfoBox color="bg-yellow-100 text-yellow-800 border-yellow-200">Feedback: {p.feedback}</RejectInfoBox>}
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
            <h3 className="text-lg font-bold mb-4 text-blue-700">Confirm status change</h3>
            <p className="mb-4">Are you sure you want to change the status?</p>
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
      .catch(() => { setError('Could not load data'); setLoading(false); });
  }, []);
  const handleStatusChange = (id, newStatus) => {
    setConfirm({ open: true, id, newStatus });
  };
  const confirmStatusChange = async () => {
    try {
      await updateAd(confirm.id, { status: confirm.newStatus });
      setAds(as => as.map(a => a._id === confirm.id ? { ...a, status: confirm.newStatus } : a));
      toast.success('Status has been updated!');
    } catch {
      toast.error('There was a problem updating the status');
    }
    setConfirm({ open: false, id: null, newStatus: '' });
  };
  const handleAdStatusButton = async (id, status) => {
    if (status === 'rejected') {
      const { value: rejectReason } = await Swal.fire({
        title: 'Do you want to reject?',
        text: 'If you reject, you must write a reason!',
        input: 'text',
        inputLabel: 'Write the reason for rejection',
        inputPlaceholder: 'Write a reason...',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Next',
        cancelButtonText: 'No',
        inputValidator: (value) => {
          if (!value) {
            return 'You must write a reason!';
          }
          return null;
        }
      });
      if (!rejectReason) return;
      const { value: adminFeedback } = await Swal.fire({
        title: 'Give feedback',
        text: 'Write feedback for the vendor (optional)',
        input: 'textarea',
        inputLabel: 'Feedback',
        inputPlaceholder: 'Write feedback...',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel',
      });
      if (adminFeedback === undefined) return;
      try {
        await updateAd(id, { status: 'rejected', rejectReason, adminFeedback });
        setAds(as => as.map(a => a._id === id ? { ...a, status: 'rejected', rejectReason, adminFeedback } : a));
        toast.success('The advertisement has been rejected!');
      } catch {
        toast.error('There was a problem rejecting');
      }
      return;
    }
    if (status === 'pending') {
      const result = await Swal.fire({
        title: 'Do you want to set to Pending?',
        text: 'The status will be set to Pending!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, set to Pending',
        cancelButtonText: 'No',
      });
      if (!result.isConfirmed) return;
    }
    if (status === 'approved') {
      const result = await Swal.fire({
        title: 'Do you want to approve?',
        text: 'The status will be set to Approved!',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve',
        cancelButtonText: 'No',
      });
      if (!result.isConfirmed) return;
      try {
        await updateAd(id, { status: 'approved', rejectReason: '', adminFeedback: '' });
        setAds(as => as.map(a => a._id === id ? { ...a, status: 'approved', rejectReason: '', adminFeedback: '' } : a));
        toast.success('Status set to approved!');
      } catch {
        toast.error('There was a problem updating the status');
      }
      return;
    }
    try {
      await updateAd(id, { status });
      setAds(as => as.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Status set to ${status}!`);
    } catch {
      toast.error('There was a problem updating the status');
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">All Ads</h2>
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
            <h3 className="text-lg font-bold mb-4 text-blue-700">Confirm status change</h3>
            <p className="mb-4">Are you sure you want to change the status?</p>
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
      .catch(() => { setError('Could not load data'); setLoading(false); });
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
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
      .catch(() => { setError('Could not load data'); setLoading(false); });
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Vendor Requests</h2>
      {requests.length === 0 ? <div className="text-gray-500">No pending requests.</div> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
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
      .catch(() => { setError('Could not load data'); setLoading(false); });
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Admin Requests</h2>
      {requests.length === 0 ? <div className="text-gray-500">No pending requests.</div> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
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

const RejectInfoBox = ({ color, children }) => (
  <div className={`text-xs rounded px-2 py-1 mt-1 max-w-[200px] break-words overflow-x-auto whitespace-pre-line border ${color}`}>{children}</div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className={`text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight ${
          isDark ? 'text-blue-400' : 'text-blue-700'
        }`}>Admin Dashboard</h1>
        
        <div className={`flex flex-wrap gap-2 mb-8 justify-center ${
          isDark ? 'bg-gray-800/80' : 'bg-white'
        } rounded-2xl shadow-lg p-2`}>
          {['users', 'products', 'ads', 'orders', 'vendorRequests', 'adminRequests'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? isDark 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-blue-500 text-white shadow-lg'
                  : isDark 
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {tab === 'users' && 'All Users'}
              {tab === 'products' && 'All Products'}
              {tab === 'ads' && 'All Ads'}
              {tab === 'orders' && 'All Orders'}
              {tab === 'vendorRequests' && 'Vendor Requests'}
              {tab === 'adminRequests' && 'Admin Requests'}
            </button>
          ))}
        </div>
        
        <div className="space-y-8">
          {activeTab === 'users' && <AllUsersTable />}
          {activeTab === 'products' && <AllProductsTable />}
          {activeTab === 'ads' && <AllAdsTable />}
          {activeTab === 'orders' && <AllOrdersTable />}
          {activeTab === 'vendorRequests' && <VendorRequestsTable />}
          {activeTab === 'adminRequests' && <AdminRequestsTable />}
        </div>
      </div>
    </div>
  );
}