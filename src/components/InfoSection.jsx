import React from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaLeaf, FaUserCircle, FaQuoteLeft, FaChevronDown } from 'react-icons/fa';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.18 } })
};

const testimonials = [
  {
    name: 'Rahat',
    location: 'Dhaka',
    text: 'Through this platform, I can easily know the daily market prices. Very helpful!'
  },
  {
    name: 'Sumaiya',
    location: 'Chittagong',
    text: 'I have been able to save a lot of money by getting the right price from the local market.'
  }
];

const faqs = [
  {
    q: 'How does this platform work?',
    a: 'You can easily see the prices of products in the market, keep them on your watchlist, and order them.'
  },
  {
    q: 'How to open an account?',
    a: 'You can easily open an account by going to the register page and providing your information.'
  },
  {
    q: 'Where do the product prices come from?',
    a: 'Prices are updated by local sellers and admins in the market.'
  },
  {
    q: 'How to order?',
    a: 'Go to the product details page and click the order button.'
  }
];

const InfoSection = () => {
  const [openFaq, setOpenFaq] = React.useState(null);
  return (
    <section className="w-full max-w-5xl mx-auto px-4 my-16 md:mt-30">
      <h2 className="text-2xl md:text-3xl font-extrabold text-green-700 mb-8 text-center tracking-tight">User's Opinion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 40px 0 #60a5fa55' }}
            className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 flex flex-col items-center text-center relative overflow-hidden group"
          >
            <FaQuoteLeft className="text-4xl text-blue-300 mb-2" />
            <p className="text-lg text-gray-700 font-medium mb-4">{t.text}</p>
            <div className="flex items-center gap-2 mt-2">
              <FaUserCircle className="text-2xl text-blue-400" />
              <span className="font-bold text-blue-700">{t.name}</span>
              <span className="text-gray-500">, {t.location}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-700 mb-8 text-center tracking-tight">Questions and Answers (FAQ)</h2>
      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded-xl shadow p-4">
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-yellow-800 text-lg focus:outline-none"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <span>{faq.q}</span>
              <FaChevronDown className={`ml-2 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
            </button>
            {openFaq === idx && (
              <div className="mt-3 text-gray-700 text-base animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoSection;