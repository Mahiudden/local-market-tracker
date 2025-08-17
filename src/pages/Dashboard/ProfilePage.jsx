import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.displayName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    photoURL: user?.photoURL || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically update the user profile in your backend
      // For now, we'll just show a success message
      toast.success('প্রোফাইল আপডেট সফল হয়েছে!');
      setIsEditing(false);
    } catch (error) {
      toast.error('প্রোফাইল আপডেট করতে সমস্যা হয়েছে!');
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.displayName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      photoURL: user?.photoURL || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white text-center">
          <div className="relative inline-block">
            <img
              src={profileData.photoURL || '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-yellow-400 text-blue-900 p-2 rounded-full hover:bg-yellow-500 transition-colors">
                <FaEdit size={16} />
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold mt-4">{profileData.name}</h1>
          <p className="text-blue-100">{profileData.email}</p>
        </div>

        {/* Profile Form */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">প্রোফাইল তথ্য</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
              >
                <FaEdit />
                সম্পাদনা করুন
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FaSave />
                  সংরক্ষণ করুন
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <FaTimes />
                  বাতিল করুন
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaUser className="text-blue-500" />
                নাম
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                  {profileData.name || 'নাম দেওয়া নেই'}
                </div>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                ইমেইল
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                  {profileData.email || 'ইমেইল দেওয়া নেই'}
                </div>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaPhone className="text-blue-500" />
                ফোন নম্বর
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                  {profileData.phone || 'ফোন নম্বর দেওয়া নেই'}
                </div>
              )}
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                ঠিকানা
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                  {profileData.address || 'ঠিকানা দেওয়া নেই'}
                </div>
              )}
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-blue-50 rounded-2xl"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-4">অতিরিক্ত তথ্য</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">সক্রিয়</div>
                <div className="text-sm text-gray-600">অ্যাকাউন্ট স্ট্যাটাস</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user?.role === 'admin' ? 'এডমিন' : user?.role === 'vendor' ? 'ভেন্ডর' : 'ব্যবহারকারী'}
                </div>
                <div className="text-sm text-gray-600">অ্যাকাউন্ট টাইপ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('bn-BD') : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">যোগদানের তারিখ</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
