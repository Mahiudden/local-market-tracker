import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBasket, FaMapMarkerAlt, FaLeaf, FaStore, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const banners = [
  {
    image: 'image3.png',
    title: 'আপনার শহরের আজকের বাজারদর',
    highlight: 'আজকের বাজারদর',
    desc: 'সাশ্রয়ী বাজারদর, টাটকা পণ্য, স্থানীয় বিক্রেতা—সব এক প্ল্যাটফর্মে।',
    button: 'সব পণ্য দেখুন',
    buttonLink: '#products',
  },
  {
    image: 'Image2.jpg',
    title: 'বিশ্বস্ত বাজার, টাটকা পণ্য',
    highlight: 'বিশ্বস্ত বাজার',
    desc: 'আপনার নিকটস্থ বাজারের সেরা দামে টাটকা পণ্য সংগ্রহ করুন।',
    button: 'বাজার খুঁজুন',
    buttonLink: '#products',
  },
  {
    image: 'image.png',
    title: 'লোকাল বিক্রেতা, বিশ্বস্ততা',
    highlight: 'লোকাল বিক্রেতা',
    desc: 'স্থানীয় বিক্রেতাদের সমর্থন করুন এবং সাশ্রয়ী বাজারদর পান।',
    button: 'বিক্রেতা দেখুন',
    buttonLink: '#products',
  },
];

const floatVariants = {
  animate: (custom) => ({
    y: [0, -12, 0],
    x: [0, custom, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: custom * 0.1 }
  })
};

const slideVariants = {
  initial: (direction) => ({ opacity: 0, x: direction > 0 ? 80 : -80 }),
  animate: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  exit: (direction) => ({ opacity: 0, x: direction < 0 ? 80 : -80, transition: { duration: 0.5 } })
};

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play every 5 seconds (setInterval)
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };
  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const banner = banners[index];

  return (
    <section className="relative h-72 md:h-96 mb-10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Background Image with Slide Animation */}
      <AnimatePresence custom={direction} mode="wait" initial={false}>
        <motion.img
          key={banner.image}
          src={banner.image}
          alt="Banner"
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full object-cover scale-105 absolute inset-0"
          style={{ zIndex: 1 }}
        />
      </AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 via-blue-700/40 to-blue-400/30 backdrop-blur-[2px]"
        style={{ zIndex: 2 }}
      />
      {/* Floating Icons */}
      <motion.div className="absolute left-8 top-8 text-yellow-300 text-3xl opacity-80 z-10" custom={-10} variants={floatVariants} animate="animate">
        <FaShoppingBasket />
      </motion.div>
      <motion.div className="absolute right-8 top-12 text-green-300 text-2xl opacity-80 z-10" custom={12} variants={floatVariants} animate="animate">
        <FaLeaf />
      </motion.div>
      <motion.div className="absolute left-10 bottom-8 text-pink-300 text-2xl opacity-80 z-10" custom={8} variants={floatVariants} animate="animate">
        <FaMapMarkerAlt />
      </motion.div>
      <motion.div className="absolute right-10 bottom-8 text-blue-200 text-3xl opacity-80 z-10" custom={-14} variants={floatVariants} animate="animate">
        <FaStore />
      </motion.div>
      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-20 px-8 py-8 md:py-12 rounded-2xl bg-white/30 backdrop-blur-md shadow-xl flex flex-col items-center max-w-2xl mx-auto"
        style={{ zIndex: 3 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg text-center leading-tight text-blue-900"
        >
          {banner.title.split(banner.highlight)[0]}
          <span className="text-yellow-400">{banner.highlight}</span>
          {banner.title.split(banner.highlight)[1]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base md:text-lg mb-5 text-blue-800/90 drop-shadow text-center max-w-xl"
        >
          {banner.desc}
        </motion.p>
        <motion.a
          href={banner.buttonLink}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1 }}
          whileHover={{ scale: 1.09, boxShadow: '0 0 16px #fde047' }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-full shadow-lg transition mt-2 text-lg tracking-wide border-2 border-yellow-200"
        >
          {banner.button}
        </motion.a>
      </motion.div>
      {/* Arrow Controls */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition z-20 border-2 border-blue-200">
        <FaChevronLeft size={22} />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/90 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition z-20 border-2 border-blue-200">
        <FaChevronRight size={22} />
      </button>
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full border-2 border-yellow-300 transition-all duration-200 ${i === index ? 'bg-yellow-400 border-yellow-400 scale-125' : 'bg-white'}`}
            aria-label={`Go to banner ${i+1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner; 