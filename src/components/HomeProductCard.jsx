import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const badgeColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
];

const productEmojis = {
  'চাল': '🍚',
  'টমেটো': '🍅',
  'পেঁয়াজ': '🧅',
  'আলু': '🥔',
  'মাছ': '🐟',
  'ডিম': '🥚',
  'গরুর মাংস': '🥩',
  'মুরগি': '🍗',
  'সবজি': '🥦',
  'ফল': '🍎',
  'দুধ': '🥛',
  'ডাল': '🌱',
};

const HomeProductCard = ({ market, date, products, image, productId }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.045, boxShadow: '0 16px 40px 0 rgba(34,139,230,0.18)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      className="relative bg-white/40 backdrop-blur-md rounded-xl shadow-2xl border-2 border-transparent group flex flex-col h-full p-7 overflow-hidden"
      style={{ borderImage: 'linear-gradient(90deg, #60a5fa 0%, #fde68a 100%) 1' }}
    >
      {/* Product Image */}
      {image && (
        <div className="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl mb-3">
          <img src={image} alt={market} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <FaStore className="text-yellow-400 text-xl" />
        <span className="font-bold text-blue-700 text-lg group-hover:text-blue-900 transition">{market}</span>
      </div>
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
        <FaCalendarAlt className="text-blue-300" />
        <span>{date}</span>
      </div>
      <ul className="flex-1 mb-4 text-gray-700 text-sm space-y-1">
        {products.map((p, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="flex justify-between items-center py-1"
          >
            <span className={`px-2 py-0.5 rounded-full text-xl font-semibold mr-2 flex items-center gap-1 ${badgeColors[i % badgeColors.length]}`}>{productEmojis[p.name] || '🛒'} {p.name}</span>
            <span className="font-bold text-blue-600">{p.price} টাকা</span>
          </motion.li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.09, boxShadow: '0 0 16px #fde047' }}
        whileTap={{ scale: 0.96 }}
        className="mt-auto bg-gradient-to-r from-blue-500 via-blue-600 to-yellow-400 text-white px-4 py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-yellow-400 hover:scale-105 transition-all font-semibold tracking-wide border-2 border-blue-200"
        onClick={() => navigate(`/product/${productId}`)}
      >
        বিস্তারিত দেখুন
      </motion.button>
    </motion.div>
  );
};

export default HomeProductCard; 