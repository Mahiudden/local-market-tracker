import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaDiscord, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-green-50 border-t py-10 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-8 px-4">
        {/* Brand & Contact */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 mb-2">
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
          </div>
          <div className="text-gray-600 text-sm text-center md:text-left">
            Contact: <a href="mailto:info@localmarket.com" className="underline hover:text-blue-600">mahiudddenmd@gmail.com</a><br/>
            <span>01712368769</span>
          </div>
          <div className="flex gap-3 text-blue-600 text-2xl mt-2">
            <a href="https://www.facebook.com/aqmmahiudden.akhon" target='_block' className="hover:text-blue-800 transition"><FaFacebook /></a>
            <a href="https://x.com/mahiudden1" target='_block' className="hover:text-blue-800 transition"><FaTwitter /></a>
            <a href="https://www.instagram.com/mahiudden11/" target='_block' className="hover:text-pink-500 transition"><FaInstagram /></a>
            <a href="https://github.com/Mahiudden" target='_block' className="hover:text-blue-500 transition"><FaGithub/></a>
          </div>
        </div>
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto justify-items-center md:justify-items-start">
          <div>
            <h4 className="font-bold text-blue-700 mb-2">Pages</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="hover:text-blue-600 transition">Home</a></li>
              <li><a href="/products" className="hover:text-blue-600 transition">All Products</a></li>
              <li><a href="/offers" className="hover:text-blue-600 transition">Offers</a></li>
            <a href="https://willowy-sunshine-e04a26.netlify.app/" target='_block' className="hover:text-blue-500 transition">other website</a>
              
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-700 mb-2">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/terms" className="hover:text-blue-600 transition">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-8">© 2025 Local Market Tracker. All rights reserved.</div>
    </footer>
  );
};

export default Footer; 