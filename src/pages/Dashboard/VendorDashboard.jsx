import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { getVendorProducts, createProduct, updateProduct, deleteProduct, createAd, getAllAds, updateAd, deleteAd } from '../../utils/api';
import Swal from 'sweetalert2';

function AddProductForm({ onProductAdded }) {
  const { user } = useAuth() || {};
  const [vendorEmail] = useState(user?.email || '');
  const [vendorName] = useState(user?.displayName || '');
  const [marketName, setMarketName] = useState('');
  const [date, setDate] = useState(new Date());
  const [marketDesc, setMarketDesc] = useState('');
  const [itemName, setItemName] = useState('');
  const [status] = useState('pending');
  const [imageUrl, setImageUrl] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [prices, setPrices] = useState([{ date: '', price: '' }]);
  const [itemDesc, setItemDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePricesChange = (idx, field, value) => {
    const newPrices = prices.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    setPrices(newPrices);
  };
  const addPriceRow = () => setPrices([...prices, { date: '', price: '' }]);
  const removePriceRow = (idx) => setPrices(prices.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!marketName || !itemName || !pricePerUnit) {
      toast.error('Market name, item name, and price per unit are required!');
      return;
    }
    if (Number(pricePerUnit) < 70) {
      toast.error('Price per unit must be at least 70!');
      return;
    }
    if (prices.some(p => p.price && Number(p.price) < 70)) {
      toast.error('All prices must be at least 70');
      return;
    }
    setLoading(true);
    try {
      await createProduct({
        name: itemName,
        marketName,
        vendorUid: user?.uid,
        vendorName: user?.displayName,
        date: date.toISOString().slice(0, 10),
        marketDesc,
        imageUrl,
        pricePerUnit: Number(pricePerUnit),
        prices: prices.filter(p => p.date && p.price),
        itemDesc,
        status,
      });
      toast.success('Product added successfully!');
      setMarketName(''); setDate(new Date()); setMarketDesc(''); setItemName(''); setImageUrl(''); setPricePerUnit(''); setPrices([{ date: '', price: '' }]); setItemDesc('');
      if (onProductAdded) onProductAdded();
    } catch {
      toast.error('Product add failed!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Add Product</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block font-semibold mb-1">📧 Vendor Email</label>
          <input type="email" value={vendorEmail} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block font-semibold mb-1">🧑‍🌾 Vendor Name</label>
          <input type="text" value={vendorName} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block font-semibold mb-1">🏪 Market Name</label>
          <input type="text" value={marketName} onChange={e => setMarketName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">📅 Date</label>
          <DatePicker selected={date} onChange={setDate} className="w-full border rounded px-3 py-2" dateFormat="yyyy-MM-dd" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">📝 Market Description</label>
          <textarea value={marketDesc} onChange={e => setMarketDesc(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} placeholder="Market location, established year, etc." />
        </div>
        <div>
          <label className="block font-semibold mb-1">🥦 Item Name</label>
          <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">📄 Status</label>
          <input type="text" value={status} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block font-semibold mb-1">🖼️ Product Image (URL)</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://..." />
          {imageUrl && <img src={imageUrl} alt="Preview" className="h-20 mt-2 rounded" />}
        </div>
        <div>
          <label className="block font-semibold mb-1">💵 Price per Unit (e.g., ৳70/kg)</label>
          <input type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} placeholder='At least 70' className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">💵 Price and Date (multiple entries)</label>
          {prices.map((p, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-2">
              <input type="date" value={p.date} onChange={e => handlePricesChange(idx, 'date', e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto" required />
              <input type="number" value={p.price} onChange={e => handlePricesChange(idx, 'price', e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto" placeholder="Price" required />
              {prices.length > 1 && <button type="button" onClick={() => removePriceRow(idx)} className="text-red-500 font-bold">✖</button>}
            </div>
          ))}
          <button type="button" onClick={addPriceRow} className="text-blue-500 font-semibold mt-1">➕ Add Row</button>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">📝 Item Description (optional)</label>
          <textarea value={itemDesc} onChange={e => setItemDesc(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} placeholder="Freshness, quality, etc." />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      <ToastContainer position="top-right" />
    </form>
  );
}

function MyProductsTable({ vendorUid }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: '', pricePerUnit: '', marketName: '', date: '', status: '',
    marketDesc: '', imageUrl: '', itemDesc: '', prices: [{ date: '', price: '' }]
  });

  const fetchProducts = () => {
    if (!vendorUid) return;
    setLoading(true);
    getVendorProducts(vendorUid)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load data');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [vendorUid]);

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      pricePerUnit: product.pricePerUnit,
      marketName: product.marketName,
      date: product.date,
      status: product.status,
      _id: product._id,
      marketDesc: product.marketDesc || '',
      imageUrl: product.imageUrl || '',
      itemDesc: product.itemDesc || '',
      prices: product.prices && product.prices.length > 0 ? product.prices : [{ date: '', price: '' }],
    });
    setEditProduct(product);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
  };
  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.pricePerUnit) < 70) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'The price of the product cannot be less than 70 Taka.',
        confirmButtonText: 'OK'
      });
      return;
    }
    try {
      await updateProduct(form._id, {
        ...form,
        pricePerUnit: Number(form.pricePerUnit)
      });
      await Swal.fire({
        icon: 'success',
        title: 'Update successful!',
        text: 'The product has been updated successfully.',
        confirmButtonText: 'OK'
      });
      fetchProducts();
      closeEditModal();
    } catch {
      Swal.fire('Error', 'There was a problem updating!', 'error');
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProduct(id);
      await Swal.fire({
        icon: 'success',
        title: 'Delete successful!',
        text: 'The product has been deleted successfully.',
        confirmButtonText: 'OK'
      });
      fetchProducts();
      setShowDeleteId(null);
    } catch {
      Swal.fire('Error', 'There was a problem deleting!', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-8">
      <h2 className="text-lg sm:text-xl font-bold mb-4">My Products</h2>
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-4 py-2 border">Item Name</th>
                <th className="px-2 sm:px-4 py-2 border">Price per Unit</th>
                <th className="px-2 sm:px-4 py-2 border">Market Name</th>
                <th className="px-2 sm:px-4 py-2 border">Date</th>
                <th className="px-2 sm:px-4 py-2 border">Status</th>
                <th className="px-2 sm:px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="text-center">
                  <td className="px-2 sm:px-4 py-2 border font-semibold">{product.name}</td>
                  <td className="px-2 sm:px-4 py-2 border">৳{product.pricePerUnit} / kg</td>
                  <td className="px-2 sm:px-4 py-2 border">{product.marketName}</td>
                  <td className="px-2 sm:px-4 py-2 border">{product.date}</td>
                  <td className="px-2 sm:px-4 py-2 border">
                    {product.status === 'pending' && <span className="text-yellow-600 font-bold">Pending</span>}
                    {product.status === 'approved' && <span className="text-green-600 font-bold">Approved</span>}
                    {product.status === 'rejected' && (
                      <div className="flex flex-col items-center">
                        <span className="text-red-600 font-bold">Rejected</span>
                        {product.reason && (
                          <FeedbackBox>Reason for rejection: {product.reason}</FeedbackBox>
                        )}
                        {product.feedback && (
                          <FeedbackBox>Feedback: {product.feedback}</FeedbackBox>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-2 border space-x-2">
                    <button onClick={() => openEditModal(product)} className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-600">Update</button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2 sm:p-0">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full max-w-xs sm:max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 text-xl" onClick={closeEditModal}>×</button>
            <h3 className="text-lg font-bold mb-4">Update Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-2 sm:space-y-3">
              <input type="text" name="name" value={form.name} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <input type="number" name="pricePerUnit" value={form.pricePerUnit} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <input type="text" name="marketName" value={form.marketName} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <input type="date" name="date" value={form.date} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <textarea name="marketDesc" value={form.marketDesc} onChange={handleEditChange} className="w-full border rounded px-3 py-2" placeholder="Market Description" />
              <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleEditChange} className="w-full border rounded px-3 py-2" placeholder="Image URL" />
              <textarea name="itemDesc" value={form.itemDesc} onChange={handleEditChange} className="w-full border rounded px-3 py-2" placeholder="Item Description" />
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                <button type="button" onClick={closeEditModal} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const initialAds = [
  {
    id: 1,
    title: 'Fresh Onion Sale!',
    description: 'Get the best onions at the lowest price.',
    image: '',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Potato Bonanza',
    description: 'Special offer on potatoes this week.',
    image: '',
    status: 'approved',
  },
];

function AddAdForm() {
  const { user } = useAuth() || {};
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [status] = useState('pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !validity) {
      toast.error('Title, description, image URL, and validity are required!');
      return;
    }
    setLoading(true);
    try {
      await createAd({
        title,
        desc: description,
        image: imageUrl,
        validity,
        status,
        vendorUid: user?.uid,
        vendorEmail: user?.email
      });
      toast.success('Advertisement added successfully!');
      setTitle('');
      setDescription('');
      setImageUrl('');
      setValidity('');
    } catch (err) {
      toast.error('Advertisement add failed!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Add Advertisement</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div>
          <label className="block font-semibold mb-1">Ad Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <input type="text" value={status} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Short Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows={2} required />
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Image URL</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="https://..." required />
          {imageUrl && imageUrl.startsWith('http') && (
            <img src={imageUrl} alt="Preview" className="h-20 mt-2 rounded" />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Valid Till (YYYY-MM-DD)</label>
          <input type="date" value={validity} onChange={e => setValidity(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
      <ToastContainer position="top-right" />
    </form>
  );
}

function MyAdsTable() {
  const { user } = useAuth() || {};
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editAd, setEditAd] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [form, setForm] = useState({ title: '', desc: '', status: '', image: '' });
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllAds()
      .then(res => {
        const filtered = (res.data || []).filter(ad => ad.vendorUid === user?.uid);
        setAds(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load advertisements');
        setLoading(false);
      });
  }, [user]);

  const openEditModal = (ad) => {
    setForm({
      ...ad,
      description: ad.desc || ad.description || '',
    });
    setEditAd(ad);
    setImageUrl(ad.image || '');
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditAd(null);
    setImageUrl('');
  };
  const handleEditChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAd(editAd._id, { ...form, desc: form.description });
      toast.success('Advertisement updated!');
      getAllAds().then(res => setAds(res.data || []));
      closeEditModal();
    } catch {
      toast.error('Update failed!');
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete this advertisement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAd(id);
      toast.success('Advertisement deleted!');
      getAllAds().then(res => setAds(res.data || []));
      setShowDeleteId(null);
    } catch {
      toast.error('Delete failed!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4">My Advertisements</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : ads.length === 0 ? (
        <div className="text-gray-500">No advertisements</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Ad Title</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Description</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Reject Reason</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Admin Feedback</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {ads.map(ad => (
                <tr key={ad._id || ad.id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{ad.title}</td>
                  <td className="px-4 py-3 text-gray-700">{ad.desc || ad.description}</td>
                  <td className="px-4 py-3">
                    <span className={
                      ad.status === 'approved' ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold' :
                      ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold' :
                      'bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold'
                    }>{ad.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {ad.rejectReason ? <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs whitespace-pre-line">{ad.rejectReason}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    {ad.adminFeedback ? <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs whitespace-pre-line">{ad.adminFeedback}</span> : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-3 flex flex-col sm:flex-row gap-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow-sm transition" onClick={() => openEditModal(ad)}>Update</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow-sm transition" onClick={() => setShowDeleteId(ad._id || ad.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="sm:hidden flex flex-col gap-4 mt-4">
            {ads.map(ad => (
              <div key={ad._id || ad.id} className="rounded-xl border border-gray-200 shadow-sm p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{ad.title}</span>
                  <span className={
                    ad.status === 'approved' ? 'bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold' :
                    ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold' :
                    'bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold'
                  }>{ad.status}</span>
                </div>
                <div className="text-gray-700 mb-1"><span className="font-semibold">Description:</span> {ad.desc || ad.description}</div>
                <div className="mb-1"><span className="font-semibold">Reject Reason:</span> {ad.rejectReason ? <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs whitespace-pre-line">{ad.rejectReason}</span> : <span className="text-gray-400">-</span>}</div>
                <div className="mb-2"><span className="font-semibold">Admin Feedback:</span> {ad.adminFeedback ? <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs whitespace-pre-line">{ad.adminFeedback}</span> : <span className="text-gray-400">-</span>}</div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow-sm transition w-full" onClick={() => openEditModal(ad)}>Update</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow-sm transition w-full" onClick={() => setShowDeleteId(ad._id || ad.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2 sm:p-0">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full max-w-xs sm:max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 text-xl" onClick={closeEditModal}>×</button>
            <h3 className="text-lg font-bold mb-4">Update Advertisement</h3>
            <form onSubmit={handleEditSubmit} className="space-y-2 sm:space-y-3">
              <input name="title" value={form.title} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <textarea name="description" value={form.description} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
              <div className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700">
                Status: <span className={
                  form.status === 'approved' ? 'text-green-600 font-bold' :
                  form.status === 'pending' ? 'text-yellow-600 font-bold' :
                  'text-red-600 font-bold'
                }>{form.status}</span>
              </div>
              <input type="text" name="image" value={form.image || ''} onChange={handleEditChange} className="w-full border rounded px-3 py-2" placeholder="Image URL (https://...)" />
              {form.image && form.image.startsWith('http') && (
                <img src={form.image} alt="Preview" className="h-20 mt-2 rounded" />
              )}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">Save</button>
            </form>
          </div>
        </div>
      )}
      {showDeleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2 sm:p-0">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 w-full max-w-xs sm:max-w-sm relative">
            <h3 className="text-lg font-bold mb-4">Delete Advertisement?</h3>
            <p>Are you sure you want to delete this advertisement?</p>
            <div className="flex gap-2 mt-4 flex-col sm:flex-row">
              <button className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={() => handleDelete(showDeleteId)}>Yes, Delete</button>
              <button className="bg-gray-300 px-4 py-2 rounded w-full sm:w-auto" onClick={() => setShowDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}

const FeedbackBox = ({ children }) => (
  <div className="text-xs text-gray-700 bg-red-100 rounded px-2 py-1 mt-1 max-w-xs break-words overflow-x-auto whitespace-pre-line border border-red-200">
    {children}
  </div>
);

export default function VendorDashboard() {
  const { user } = useAuth() || {};
  const [refresh, setRefresh] = useState(false);
  const [tab, setTab] = useState('addProduct');
  const handleProductAdded = () => setRefresh(r => !r);
  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 md:px-8 lg:px-12">
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button onClick={() => setTab('addProduct')} className={tab==='addProduct'?'bg-blue-500 text-white px-3 sm:px-4 py-2 rounded':'bg-gray-100 px-3 sm:px-4 py-2 rounded'}>📝 Add Product</button>
        <button onClick={() => setTab('myProducts')} className={tab==='myProducts'?'bg-blue-500 text-white px-3 sm:px-4 py-2 rounded':'bg-gray-100 px-3 sm:px-4 py-2 rounded'}>📄 My Products</button>
        <button onClick={() => setTab('addAd')} className={tab==='addAd'?'bg-blue-500 text-white px-3 sm:px-4 py-2 rounded':'bg-gray-100 px-3 sm:px-4 py-2 rounded'}>📢 Add Advertisement</button>
        <button onClick={() => setTab('myAds')} className={tab==='myAds'?'bg-blue-500 text-white px-3 sm:px-4 py-2 rounded':'bg-gray-100 px-3 sm:px-4 py-2 rounded'}>📊 My Advertisements</button>
      </div>
      <div className="w-full">
        {tab === 'addProduct' && <AddProductForm onProductAdded={handleProductAdded} />}
        {tab === 'myProducts' && <div className="overflow-x-auto"><MyProductsTable vendorUid={user?.uid} key={refresh} /></div>}
        {tab === 'addAd' && <AddAdForm />}
        {tab === 'myAds' && <div className="overflow-x-auto"><MyAdsTable /></div>}
      </div>
    </div>
  );
}