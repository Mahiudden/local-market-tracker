import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaDiscord, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`py-8 md:py-10 lg:py-12 mt-16 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-100 shadow-2xl border-t border-gray-700/50' 
        : 'bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 text-gray-800 shadow-lg border-t border-blue-200/50'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8 px-4 md:px-6 lg:px-8">
        {/* Brand & Contact */}
        <motion.div 
          className="flex flex-col items-center md:items-start gap-3 md:gap-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Link to="/" className="flex items-center group">
              <motion.img
                whileHover={{ scale: 1.12, rotate: 8 }}
                whileTap={{ scale: 0.95, rotate: -8 }}
                src="/logo1.png"
                alt="Logo"
                className={`h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full shadow-lg transition-all duration-300 ${
                  isDark ? 'bg-gray-700/80 group-hover:bg-gray-600/80' : 'bg-white/80 group-hover:bg-white'
                } hover:shadow-2xl`}
              />
              <span
                className={`ml-2 md:ml-3 text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold tracking-wide drop-shadow-lg transition-all duration-300 ${
                  isDark 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-green-300 to-yellow-300 group-hover:from-blue-200 group-hover:via-green-200 group-hover:to-yellow-200' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 group-hover:from-yellow-400 group-hover:via-green-400 group-hover:to-blue-400'
                }`}
                style={{ letterSpacing: '0.04em', fontFamily: `'Poppins', 'Lobster', 'Nunito', 'Quicksand', 'Montserrat', 'Inter', cursive, sans-serif` }}
              >
                Local Market Tracker
              </span>
            </Link>
          </div>
          <motion.div 
            className={`text-xs md:text-sm text-center md:text-left ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contact: <a href="mailto:mahiudddenmd@gmail.com" className={`underline hover:text-blue-400 transition-colors duration-300 ${
              isDark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-500'
            }`}>mahiudddenmd@gmail.com</a><br/>
            <span className={`${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>01712368769</span>
          </motion.div>
          <motion.div 
            className={`flex gap-2 md:gap-3 text-xl md:text-2xl mt-2 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.a 
              href="https://www.facebook.com/aqmmahiudden.akhon" 
              target='_blank' 
              className={`hover:scale-110 transition-all duration-300 ${
                isDark ? 'hover:text-blue-300' : 'hover:text-blue-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a 
              href="https://x.com/mahiudden1" 
              target='_blank' 
              className={`hover:scale-110 transition-all duration-300 ${
                isDark ? 'hover:text-blue-300' : 'hover:text-blue-800'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/mahiudden11/" 
              target='_blank' 
              className={`hover:scale-110 transition-all duration-300 ${
                isDark ? 'hover:text-pink-400' : 'hover:text-pink-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="https://github.com/Mahiudden" 
              target='_blank' 
              className={`hover:scale-110 transition-all duration-300 ${
                isDark ? 'hover:text-blue-300' : 'hover:text-blue-500'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub/>
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Links */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full md:w-auto justify-items-center md:justify-items-start"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h4 className={`font-bold mb-2 md:mb-3 text-sm md:text-base ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}>Pages</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><motion.a 
                href="/" 
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Home</motion.a></li>
              <li><motion.a 
                href="/products" 
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >All Products</motion.a></li>
              <li><motion.a 
                href="/offers" 
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Offers</motion.a></li>
              <li><motion.a 
                href="https://willowy-sunshine-e04a26.netlify.app/" 
                target='_blank' 
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Other Website</motion.a></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-bold mb-2 md:mb-3 text-sm md:text-base ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}>Legal</h4>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><motion.a 
                href="/terms" 
                className={`hover:text-blue-400 transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >Terms & Conditions</motion.a></li>
            </ul>
          </div>
        </motion.div>
      </div>
      
      {/* Copyright */}
      <motion.div 
        className={`text-center text-xs md:text-sm mt-6 md:mt-8 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        © 2025 Local Market Tracker. All rights reserved.
      </motion.div>
      
      {/* Theme Indicator */}
      <motion.div 
        className={`text-center text-xs mt-4 ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </motion.div>
    </footer>
  );
};

export default Footer; 