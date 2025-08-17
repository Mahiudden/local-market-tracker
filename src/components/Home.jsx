import React, { useState, useEffect } from 'react';
import Banner from '../components/Banner';
import AdvertisementCarousel from '../components/AdvertisementCarousel';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';
import { FaSearch, FaStore, FaStar, FaEnvelope, FaChartLine, FaTags, FaUsers, FaShoppingCart, FaGift, FaMapMarkerAlt, FaClock, FaPercent } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import HomeProductCard from '../components/HomeProductCard';
import { getAllProducts } from '../utils/api';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.12,
      duration: 0.5,
      ease: "easeOut"
    } 
  })
};

const Home = () => {
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load products');
        setLoading(false);
      });
  }, []);

  const topRatedProducts = products
    .filter(p => p.status === 'approved')
    .map(p => ({
      ...p,
      avgRating: p.reviews && p.reviews.length > 0 ? (p.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / p.reviews.length) : 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6);

  const specialOffers = [
    {
      id: 1,
      title: 'Vegetable Special Offer',
      description: 'Fresh vegetables at 20% discount',
      discount: '20%',
      validUntil: '3 days',
      image: '🥬',
      color: 'green'
    },
    {
      id: 2,
      title: 'Best price for fish',
      description: 'Fresh fish at a special price',
      discount: '15%',
      validUntil: '2 days',
      image: '🐟',
      color: 'blue'
    },
    {
      id: 4,
      title: 'Special price for rice',
      description: 'High quality rice at a low price',
      discount: '10%',
      validUntil: '7 days',
      image: '🍚',
      color: 'yellow'
    }
  ];

  const marketHighlights = [
    {
      id: 1,
      market: 'Kawran Bazar',
      location: 'Dhaka',
      rating: 4.8,
      products: 150,
      image: '🏪',
      description: 'The biggest green market',
      status: 'Open'
    },
    {
      id: 2,
      market: 'New Market',
      location: 'Dhaka',
      rating: 4.6,
      products: 120,
      image: '🛒',
      description: 'Modern shopping complex',
      status: 'Open'
    },
    {
      id: 3,
      market: 'Gabtoli Bazar',
      location: 'Dhaka',
      rating: 4.4,
      products: 95,
      image: '🏬',
      description: 'Local market',
      status: 'Open'
    },
    
  ];

  const reviews = [
    { name: 'Ahmed Ali', rating: 5, comment: 'Got excellent service. The price is also low.', avatar: '👨‍💼' },
    { name: 'Fatema Begum', rating: 5, comment: 'Got fresh vegetables. Very satisfied.', avatar: '👩‍💼' },
    { name: 'Karim Hossain', rating: 4, comment: 'Good products at affordable prices.', avatar: '👨‍💼' },
  ];

  const stats = [
    { label: 'Total Users', value: '10,000+', icon: FaUsers },
    { label: 'Total Sellers', value: '500+', icon: FaStore },
    { label: 'Satisfied Customers', value: '95%', icon: FaStar },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Newsletter subscription successful!');
    setNewsletterEmail('');
  };

  return (
    <>
      <Banner />
      
      <section id="products" className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaStore className="text-yellow-400 text-3xl lg:text-4xl" />
          Today's Market Price
        </h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 xl:gap-10 bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-10 shadow-2xl grid-responsive"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading products...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            </div>
          ) : topRatedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No information found</p>
            </div>
          ) : (
            <AnimatePresence>
              {topRatedProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="h-full"
                >
                  <HomeProductCard
                    market={product.marketName || 'Unknown Market'}
                    date={product.date || new Date().toLocaleDateString()}
                    products={[{ name: product.name, price: product.pricePerUnit }]}
                    image={product.imageUrl || '/default-product.png'}
                    productId={product._id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </section>

      <AdvertisementCarousel showDots />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaGift className="text-red-400 text-3xl lg:text-4xl" />
          Special Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 grid-responsive">
          {specialOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer relative overflow-hidden border border-gray-200 dark:border-gray-600"
            >
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {offer.discount} Off
              </div>
              
              <div className="text-4xl mb-4 text-center">{offer.image}</div>
              
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-center text-sm lg:text-base">{offer.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-3 text-center">{offer.description}</p>
              
              <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                <FaClock className="mr-1" />
                <span>Validity: {offer.validUntil}</span>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 text-sm">
                See Offer
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaMapMarkerAlt className="text-green-400 text-3xl lg:text-4xl" />
          Market Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 grid-responsive">
          {marketHighlights.map((market, i) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200 dark:border-gray-600"
            >
              <div className="text-4xl mb-4 text-center">{market.image}</div>
              
              <h3 className="font-bold text-black dark:text-gray-200 mb-1 text-center text-sm lg:text-base">{market.market}</h3>
              <p className="text-black dark:text-gray-400 text-xs lg:text-sm mb-3 text-center">{market.location}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-4 text-center">{market.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 text-sm mr-1" />
                    <span className="text-xs lg:text-sm font-semibold text-gray-800 dark:text-gray-200">{market.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Products:</span>
                  <span className="text-xs lg:text-sm font-semibold text-gray-800 dark:text-gray-200">{market.products}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-xs lg:text-sm font-semibold text-green-600 dark:text-green-400">{market.status}</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 text-sm">
                See Market
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaStar className="text-yellow-400 text-3xl lg:text-4xl" />
          Customer's Opinion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 grid-responsive">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{review.avatar}</div>
                <div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 text-sm lg:text-base">{review.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic text-xs lg:text-sm">"{review.comment}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
          <FaChartLine className="text-green-400 text-3xl lg:text-4xl" />
          Our Success Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8 grid-responsive">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 lg:p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              <div className="text-2xl lg:text-3xl text-blue-500 dark:text-blue-400 mb-2">
                <stat.icon />
              </div>
              <div className="text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-3xl shadow-2xl p-6 lg:p-8 text-center text-white">
          <FaEnvelope className="text-3xl lg:text-4xl mx-auto mb-4 text-yellow-300" />
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-blue-100 dark:text-blue-200 mb-6 text-sm lg:text-base">Get the latest information about new products and offers</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-xl transition-colors duration-300 text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <InfoSection />
    </>
  );
};

export default Home;