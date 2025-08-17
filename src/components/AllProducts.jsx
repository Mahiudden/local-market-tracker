import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getApprovedProducts } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark } = useTheme();

  useEffect(() => {
    setLoading(true);
    getApprovedProducts()
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load products');
        setLoading(false);
      });
  }, []);

  let filtered = products.filter(p =>
    (!date || p.date === date) &&
    (p.marketName?.toLowerCase().includes(search.toLowerCase()) || p.name?.toLowerCase().includes(search.toLowerCase()))
  );

  if (sort === 'asc') {
    filtered = [...filtered].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
  } else if (sort === 'desc') {
    filtered = [...filtered].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
  }

  const total = filtered.length;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className={`text-center py-10 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>Loading...</div>;
  if (error) return <div className={`text-center py-10 ${isDark ? 'text-red-400' : 'text-red-500'}`}>{error}</div>;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className={`text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-tight ${
          isDark ? 'text-blue-400' : 'text-blue-700'
        }`}>All Products</h2>
        
        <div className={`flex flex-wrap gap-3 mb-8 items-center justify-center rounded-3xl shadow p-4 transition-all duration-500 ${
          isDark 
            ? 'bg-gray-800/80 border border-gray-700/50' 
            : 'bg-white'
        }`}>
          <input 
            type="text" 
            placeholder="Search..." 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            className={`border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition w-40 ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-blue-400' 
                : 'border-blue-200 bg-white text-gray-800 placeholder-gray-500 focus:ring-blue-300'
            }`} 
          />
          
          <input 
            type="date" 
            value={date} 
            onChange={e=>setDate(e.target.value)} 
            className={`border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-400' 
                : 'border-blue-200 bg-white text-gray-800 focus:ring-blue-300'
            }`} 
          />
          
          <select 
            value={sort} 
            onChange={e=>setSort(e.target.value)} 
            className={`border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-400' 
                : 'border-blue-200 bg-white text-gray-800 focus:ring-blue-300'
            }`}
          >
            <option value="" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>
              Sort by Price
            </option>
            <option value="asc" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>
              Price: Low to High
            </option>
            <option value="desc" className={isDark ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'}>
              Price: High to Low
            </option>
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
            <div className={`col-span-full text-center font-semibold py-8 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`}>No information found</div>
          )}
        </div>
        
        <div className="flex gap-2 mt-10 justify-center">
          <button 
            onClick={()=>setPage(p=>Math.max(1,p-1))} 
            disabled={page===1} 
            className={`px-4 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50 ${
              isDark 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-100'
            }`}
          >
            Prev
          </button>
          
          <span className={`px-3 py-2 rounded-xl shadow font-bold ${
            isDark 
              ? 'bg-gray-700 text-gray-200' 
              : 'bg-white text-blue-700'
          }`}>
            {page}
          </span>
          
          <button 
            onClick={()=>setPage(p=>p*perPage<total?p+1:p)} 
            disabled={page*perPage>=total} 
            className={`px-4 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50 ${
              isDark 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default AllProducts;
