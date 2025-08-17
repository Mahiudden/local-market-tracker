import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const Header = () => {
  const { user, logout, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinksArr = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'All Products' },
    { to: '/offers', label: 'Offers' },
  ];
  if (user && role === 'user') {
    navLinksArr.push({ to: '/become-vendor', label: 'be a vendor' });
    navLinksArr.push({ to: '/become-admin', label: 'be a admin' });
  }
  if (!user) {
    navLinksArr.push({ to: '/login', label: 'Login' }, { to: '/register', label: 'Sign Up' });
  } else {
    navLinksArr.push({ to: `/dashboard/${role}`, label: 'Dashboard' });
    navLinksArr.push({ to: '/profile', label: 'Profile' });
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <header className="sticky top-0 z-30 px-4 py-3 flex justify-around items-center bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow-xl transition-all duration-300">
      <Link to="/" className="flex items-center">
        <motion.img
          whileHover={{ scale: 1.12, rotate: 8 }}
          whileTap={{ scale: 0.95, rotate: -8 }}
          src="/logo1.png"
          alt="Logo"
          className="h-10 w-10 rounded-full shadow-lg hover:shadow-2xl transition"
        />
        <span
          className="ml-3 text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-white drop-shadow-lg"
          style={{ letterSpacing: '0.04em', fontFamily: `'Poppins', 'Lobster', 'Nunito', 'Quicksand', 'Montserrat', 'Inter', cursive, sans-serif` }}
        >
          Local Market Tracker
        </span>
      </Link>

      <motion.nav
        className="hidden lg:flex gap-2 text-white font-medium items-center"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        {navLinksArr.map((link, i) => (
          <motion.div key={link.to} variants={linkVariants} whileHover={{ scale: 1.08 }}>
            <Link 
              to={link.to} 
              className={`px-3 py-2 rounded hover:bg-white/20 transition-all duration-200 block font-semibold tracking-wide text-white hover:text-blue-100 ${
                location.pathname === link.to ? 'bg-white/20' : ''
              }`}
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
        
        <motion.button
          onClick={handleThemeToggle}
          className="p-3 rounded-full hover:bg-white/20 transition-colors duration-300 border border-white/30 bg-white/10"
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <FaSun className="text-yellow-300 text-lg" />
          ) : (
            <FaMoon className="text-blue-100 text-lg" />
          )}
        </motion.button>

        {user && (
          <motion.div className="flex items-center gap-2 ml-2" whileHover={{ scale: 1.08 }}>
            {user.photoURL && (
              <motion.img
                src={user.photoURL}
                alt="Profile"
                className="h-8 w-8 rounded-full shadow border-2 border-white/30"
                whileHover={{ rotate: 12, scale: 1.15 }}
                whileTap={{ scale: 0.95, rotate: -12 }}
              />
            )}
            <span className="text-sm font-semibold text-white drop-shadow">{user.displayName || user.email}</span>
            <button 
              onClick={handleLogout} 
              className="ml-2 px-3 py-1 text-xs bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors border border-red-400/30"
            >
              Logout
            </button>
          </motion.div>
        )}
      </motion.nav>

      <button
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-white/20 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>
      
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-4 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 flex flex-col gap-2 lg:hidden z-40 border border-white/20 dark:border-gray-600/20"
          >
            {navLinksArr.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg hover:bg-blue-100/80 dark:hover:bg-gray-700/80 text-blue-700 dark:text-gray-200 font-semibold transition-colors ${
                  location.pathname === link.to ? 'bg-blue-100/80 dark:bg-gray-700/80' : ''
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={handleThemeToggle}
              className="px-3 py-2 rounded-lg hover:bg-blue-100/80 dark:hover:bg-gray-700/80 text-blue-700 dark:text-gray-200 font-semibold transition-colors flex items-center gap-2"
            >
              {isDark ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-500" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
                {user.photoURL && (
                  <motion.img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full shadow border-2 border-gray-200 dark:border-gray-600"
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    whileTap={{ scale: 0.95, rotate: -12 }}
                  />
                )}
                <span className="text-sm font-semibold text-blue-700 dark:text-gray-200">{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="ml-2 px-3 py-1 text-xs bg-red-500/80 text-white rounded hover:bg-red-600 transition-colors border border-red-400/30">Logout</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
