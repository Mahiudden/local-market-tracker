import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt, FaImage } from 'react-icons/fa';
import { getAllProducts } from '../utils/api';
// import { useAuth } from '../context/AuthContext'; // Uncomment if you have AuthContext

const badgeColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
];

const ProductSection = () => {
  // const { user } = useAuth(); // Uncomment if you have AuthContext
  const user = null; // Mock: not logged in
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(res => {
        // Filter for approved products and limit to 6
        const approved = (res.data || []).filter(p => p.status === 'approved').slice(0, 6);
        setProducts(approved);
        setLoading(false);
      })
      .catch(() => {
        setError('পণ্য লোড করা যায়নি');
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (id) => {
    if (!user) navigate('/login');
    else navigate(`/product/${id}`);
  };

  if (loading) return <div className="text-center py-10 text-blue-500">লোড হচ্ছে...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
        <FaStore className="text-yellow-400 text-3xl" />
        আজকের বাজারদর
      </h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 bg-white/80 rounded-3xl p-10 shadow-2xl border border-blue-100"
        initial="hidden"
        animate="visible"
      >
        {products.length ? products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            className="h-full bg-white/60 rounded-2xl shadow-lg border border-blue-100 flex flex-col overflow-hidden"
          >
            <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {p.image ? (
                <img src={p.image} alt={p.market} className="object-cover w-full h-full" />
              ) : (
                <FaImage className="text-5xl text-blue-200" />
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                <FaStore className="text-yellow-400 text-lg" />
                <span className="font-bold text-blue-700 text-lg">{p.market}</span>
              </div>
              <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                <FaCalendarAlt className="text-blue-300" />
                <span>{p.date}</span>
              </div>
              <ul className="flex-1 mb-3 text-gray-700 text-sm space-y-1">
                {p.products && p.products.map((item, j) => (
                  <li key={j} className="flex justify-between items-center py-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold mr-2 flex items-center gap-1 ${badgeColors[j % badgeColors.length]}`}>{item.emoji} {item.name}</span>
                    <span className="font-bold text-blue-600">৳{item.price}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: '0 0 12px #2563eb' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleViewDetails(p.id)}
                className="mt-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all font-semibold tracking-wide border-2 border-blue-200"
              >
                বিস্তারিত দেখুন
              </motion.button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center text-blue-500 font-semibold py-8">কোনো তথ্য পাওয়া যায়নি</div>
        )}
      </motion.div>
    </section>
  );
};

export default ProductSection; 