import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaBullhorn } from 'react-icons/fa';
import { getAllAds } from '../utils/api';
import { Link } from 'react-router-dom';

const adVariants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.4 } },
};

const AdvertisementCarousel = () => {
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllAds()
      .then(res => {
        const approved = (res.data || []).filter(ad => ad.status === 'approved');
        setAds(approved);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load advertisements');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!ads.length) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % ads.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [ads, index]);

  if (loading) return <div className="text-center py-10 text-blue-500">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!ads.length) return null;
  const ad = ads[index];

  const prev = () => setIndex(i => (i === 0 ? ads.length - 1 : i - 1));
  const next = () => setIndex(i => (i === ads.length - 1 ? 0 : i + 1));

  return (
    <section className="my-6 flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2"><FaBullhorn className="text-yellow-400" /> Advertisements & Offers</h3>
      <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ad.id}
            variants={adVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="bg-white/80 rounded-3xl shadow-xl p-6 min-w-[250px] flex flex-col items-center transition hover:shadow-2xl absolute w-full"
            style={{ position: 'absolute' }}
          >
            <img src={ad.image} alt={ad.title} className="w-full h-[200px] object-cover rounded-2xl mb-3 shadow" />
            <h4 className="mb-1 font-bold text-blue-700 text-lg text-center">{ad.title}</h4>
            <p className="text-sm text-gray-700 mb-2 text-center">{ad.desc || ad.description}</p>
            <Link to={ad.link ? ad.link : '/offers'}  className="text-blue-600 hover:underline font-semibold mb-2">Details</Link>
          </motion.div>
        </AnimatePresence>
        <button onClick={prev} className="absolute left-0 top-[170px] -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition -ml-4 z-10"><FaChevronLeft /></button>
        <button onClick={next} className="absolute right-0 top-[170px] -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition -mr-4 z-10"><FaChevronRight /></button>
      </div>
      <div className="flex gap-2 mt-86">
        {ads.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${i === index ? 'bg-blue-500 scale-125' : 'bg-white'}`}
            aria-label={`Go to ad ${i+1}`}
            animate={i === index ? { scale: 1.25 } : { scale: 1 }}
            whileHover={{ scale: 1.4 }}
          />
        ))}
      </div>
    </section>
  );
};

export default AdvertisementCarousel;