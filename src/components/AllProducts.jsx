import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getApprovedProducts } from '../utils/api';


const AllProducts = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const perPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getApprovedProducts()
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('পণ্য লোড করা যায়নি');
        setLoading(false);
      });
  }, []);

  let filtered = products;
  filtered = filtered.filter(p =>
    (!date || p.date === date) &&
    (p.marketName?.toLowerCase().includes(search.toLowerCase()) || p.name?.toLowerCase().includes(search.toLowerCase()))
  );
  if (sort === 'asc') filtered = [...filtered].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
  if (sort === 'desc') filtered = [...filtered].sort((a, b) => b.pricePerUnit - a.pricePerUnit);

  const total = filtered.length;
  const paged = filtered.slice((page-1)*perPage, page*perPage);

  if (loading) return <div className="text-center py-10 text-blue-500">লোড হচ্ছে...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">সব পণ্য</h2>
        <div className="flex flex-wrap gap-3 mb-8 items-center justify-center bg-white rounded-xl shadow p-4 border border-blue-100">
          <input type="text" placeholder="সার্চ..." value={search} onChange={e=>setSearch(e.target.value)} className="border border-blue-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition w-40" />
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border border-blue-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition" />
          <select value={sort} onChange={e=>setSort(e.target.value)} className="border border-blue-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition">
            <option value="">Sort by Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paged.length ? paged.map((p) => (
            <ProductCard
              key={p._id}
              market={p.marketName}
              date={p.date}
              products={[{ name: p.name, price: p.pricePerUnit }]}
              image={p.imageUrl}
              onViewDetails={() => navigate(`/product/${p._id}`)}
            />
          )) : (
            <div className="col-span-full text-center text-blue-500 font-semibold py-8">কোনো তথ্য পাওয়া যায়নি</div>
          )}
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition disabled:opacity-50">Prev</button>
          <span className="px-3 py-2 bg-white rounded shadow border border-blue-100 font-bold text-blue-700">{page}</span>
          <button onClick={()=>setPage(p=>p*perPage<total?p+1:p)} disabled={page*perPage>=total} className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts; 