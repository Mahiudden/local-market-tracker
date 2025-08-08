import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
  }

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 px-4 py-3 border-b border-blue-200 flex justify-around items-center bg-gradient-to-r from-blue-700 to-blue-400 shadow-xl">
      <Link to="/" className="flex items-center">
        <motion.img
          whileHover={{ scale: 1.12, rotate: 8 }}
          whileTap={{ scale: 0.95, rotate: -8 }}
          src="/logo1.png"
          alt="Logo"
          className="h-10 w-10 rounded-full border-2 border-white shadow-lg bg-white/80 hover:shadow-2xl transition"
        />
        <span
          className="ml-3 text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 drop-shadow-lg mt-1 mb-1"
          style={{ letterSpacing: '0.04em', fontFamily: `'Poppins', 'Lobster', 'Nunito', 'Quicksand', 'Montserrat', 'Inter', cursive, sans-serif` }}
        >
          Local Market Tracker
        </span>
      </Link>
      {/* Desktop nav */}
      <motion.nav
        className="hidden md:flex gap-2 text-white font-medium items-center"
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        {navLinksArr.map((link, i) => (
          <motion.div key={link.to} variants={linkVariants} whileHover={{ scale: 1.08 }}>
            <Link to={link.to} className="px-3 py-2 rounded hover:bg-white/20 transition block font-semibold tracking-wide">
              {link.label}
            </Link>
          </motion.div>
        ))}
        {user && (
          <motion.div className="flex items-center gap-2 ml-2" whileHover={{ scale: 1.08 }}>
            {user.photoURL && (
              <motion.img
                src={user.photoURL}
                alt="Profile"
                className="h-8 w-8 rounded-full border-2 border-white shadow"
                whileHover={{ rotate: 12, scale: 1.15 }}
                whileTap={{ scale: 0.95, rotate: -12 }}
              />
            )}
            <span className="text-sm font-semibold text-white drop-shadow">{user.displayName || user.email}</span>
            <button onClick={handleLogout} className="ml-2 px-2 py-1 text-xs bg-white/20 text-white rounded hover:bg-red-500 hover:text-white transition">Logout</button>
          </motion.div>
        )}
      </motion.nav>
      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-white/10 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-white mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white mb-1 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>
      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-4 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 flex flex-col gap-2 md:hidden z-40"
          >
            {navLinksArr.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-lg hover:bg-blue-100 text-blue-700 font-semibold transition"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center gap-2 mt-2">
                {user.photoURL && (
                  <motion.img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-blue-200 shadow"
                    whileHover={{ rotate: 12, scale: 1.15 }}
                    whileTap={{ scale: 0.95, rotate: -12 }}
                  />
                )}
                <span className="text-sm font-semibold text-blue-700">{user.displayName || user.email}</span>
                <button onClick={handleLogout} className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-red-500 hover:text-white transition">Logout</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 