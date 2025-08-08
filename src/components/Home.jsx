import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import AdvertisementCarousel from '../components/AdvertisementCarousel';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';
import { FaSearch, FaStore } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import HomeProductCard from '../components/HomeProductCard';
import { getAllProducts } from '../utils/api';
// import { Head } from 'react-head'; // এই লাইন মুছে ফেললাম

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12 } })
};

const Home = () => {
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('পণ্য লোড করা যায়নি');
        setLoading(false);
      });
  }, []);

  // রেটিং অনুযায়ী টপ ৬টি প্রোডাক্ট বের করব
  const topRatedProducts = products
    .filter(p => p.status === 'approved')
    .map(p => ({
      ...p,
      avgRating: p.reviews && p.reviews.length > 0 ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length) : 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  if (loading) return <div className="text-center py-10 text-blue-500">লোড হচ্ছে...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      <title>Home | Local Market Tracker</title>
      <Banner />
      {/* সার্চ বক্স রিমুভ */}
      {/* <div className="flex justify-center mt-[-2rem] mb-8 z-10 relative">
        <motion.div
          className={`bg-white rounded-full shadow-lg flex items-center px-4 py-2 w-full max-w-md border transition-all duration-300 ${focus ? 'border-blue-400 shadow-2xl scale-105' : 'border-blue-200'}`}
          animate={focus ? { scale: 1.05, boxShadow: '0 8px 32px 0 rgba(34,139,230,0.15)' } : { scale: 1 }}
        >
          <FaSearch className="text-blue-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="বাজার বা পণ্যের নাম লিখুন..."
            className="flex-1 outline-none bg-transparent text-blue-700 placeholder-blue-300 text-base"
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </motion.div>
      </div> */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaStore className="text-yellow-400 text-3xl" />
          আজকের বাজারদর
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 bg-white/80 rounded-3xl p-10 shadow-2xl border border-blue-100"
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {topRatedProducts.length ? topRatedProducts.map((p, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="h-full"
              >
                <HomeProductCard
                  market={p.marketName}
                  date={p.date}
                  products={[{ name: p.name, price: p.pricePerUnit }]}
                  image={p.imageUrl}
                  productId={p._id}
                />
              </motion.div>
            )) : (
              <motion.div className="col-span-full text-center text-blue-500 font-semibold py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                কোনো তথ্য পাওয়া যায়নি
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
      <AdvertisementCarousel showDots />
      <InfoSection />
    </>
  );
};

export default Home; 