import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaEdit, FaSave, FaTimes, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updateUserProfile, getUserByUid, changePassword } from '../utils/api';

const Profile = () => {
  const { user, role, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      const loadUserProfile = async () => {
        try {
          const response = await getUserByUid(user.uid);
          const userData = response.data;
          
          if (!isEditing) {
            setFormData({
              displayName: userData.displayName || user.displayName || '',
              email: userData.email || user.email || '',
              phone: userData.phone || '',
              address: userData.address || ''
            });
          }
          
          if (updateUser) {
            const updatedUser = {
              ...user,
              displayName: userData.displayName || user.displayName,
              phone: userData.phone,
              address: userData.address
            };
            updateUser(updatedUser);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          if (!isEditing) {
            setFormData({
              displayName: user.displayName || '',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || ''
            });
          }
        }
      };
      
      loadUserProfile();
    }
  }, [user, updateUser, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      await updateUserProfile({
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address
      });
      
      const userResponse = await getUserByUid(user.uid);
      const updatedUserData = userResponse.data;
      
      const updatedUser = {
        ...user,
        displayName: updatedUserData.displayName || formData.displayName,
        phone: updatedUserData.phone || formData.phone,
        address: updatedUserData.address || formData.address
      };
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      setFormData({
        displayName: updatedUserData.displayName || formData.displayName,
        email: updatedUserData.email || user.email,
        phone: updatedUserData.phone || formData.phone,
        address: updatedUserData.address || formData.address
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Sending password change request with:', { newPassword: passwordData.newPassword });
      await changePassword(passwordData.newPassword);
      toast.success('Password changed successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password change error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
      }`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
          <p>You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl shadow-2xl overflow-hidden ${
            isDark ? 'bg-gray-800/90' : 'bg-white/90'
          } backdrop-blur-sm`}>
          {/* Header Section */}
          <div className={`p-8 text-center ${
            isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-green-500'
          }`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-white/30 shadow-2xl"
                />
              ) : (
                <div className={`h-24 w-24 rounded-full border-4 border-white/30 shadow-2xl flex items-center justify-center ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <FaUser className="text-4xl text-gray-500" />
                </div>
              )}
            </motion.div>
            <h1 className={`text-3xl font-bold text-white mb-2 ${
              user.displayName ? '' : 'capitalize'
            }`}>
              {user.displayName || user.name || 'User Profile'}
            </h1>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark ? 'bg-gray-800/50' : 'bg-white/20'
            } text-white`}>
              <FaShieldAlt className="text-sm" />
              <span className="text-sm font-semibold capitalize">{role || 'user'}</span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>Profile Information</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isEditing) {
                    handleCancel();
                  } else {
                    const currentFormData = {
                      displayName: user.displayName || user.name || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      address: user.address || ''
                    };
                    setFormData(currentFormData);
                    setIsEditing(true);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isEditing
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isEditing ? <FaTimes className="inline mr-2" /> : <FaEdit className="inline mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <FaUser className={`text-xl ${
                    isDark ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                  <label className={`font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Display Name</label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? 'border-gray-600 bg-gray-600 text-gray-100 focus:ring-blue-400 focus:border-blue-400'
                        : 'border-gray-300 bg-white text-gray-800 focus:ring-blue-300 focus:border-blue-400'
                    }`}
                    placeholder="Enter display name"
                  />
                ) : (
                  <p className={`text-lg ${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {user.displayName || user.name || 'Not set'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <FaEnvelope className={`text-xl ${
                    isDark ? 'text-green-400' : 'text-green-500'
                  }`} />
                  <label className={`font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Email</label>
                </div>
                <p className={`text-lg ${
                  isDark ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {user.email}
                </p>
                <p className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Email cannot be changed
                </p>
              </div>

              {/* Phone Number */}
              <div className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <FaCalendarAlt className={`text-xl ${
                    isDark ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <label className={`font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Phone Number</label>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? 'border-gray-600 bg-gray-600 text-gray-100 focus:ring-purple-400 focus:border-purple-400'
                        : 'border-gray-300 bg-white text-gray-800 focus:ring-purple-300 focus:border-purple-400'
                    }`}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className={`text-lg ${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {user.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <FaShieldAlt className={`text-xl ${
                    isDark ? 'text-orange-400' : 'text-orange-500'
                  }`} />
                  <label className={`font-semibold ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}>Address</label>
                </div>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? 'border-gray-600 bg-gray-600 text-gray-100 focus:ring-orange-400 focus:border-orange-400'
                        : 'border-gray-300 bg-white text-gray-800 focus:ring-orange-300 focus:border-orange-400'
                    }`}
                    placeholder="Enter address"
                  />
                ) : (
                  <p className={`text-lg ${
                    isDark ? 'text-gray-100' : 'text-gray-800'
                  }`}>
                    {user.address || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Change Password Section */}
            <div className={`mt-8 p-6 rounded-2xl ${
              isDark ? 'bg-gray-700/30' : 'bg-blue-50'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className={`p-6 rounded-2xl ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FaKey className={`text-xl ${
                        isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <label className={`font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>New Password</label>
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isDark
                          ? 'border-gray-600 bg-gray-600 text-gray-100 focus:ring-yellow-400 focus:border-yellow-400'
                          : 'border-gray-300 bg-white text-gray-800 focus:ring-yellow-300 focus:border-yellow-400'
                      }`}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className={`p-6 rounded-2xl ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FaKey className={`text-xl ${
                        isDark ? 'text-yellow-400' : 'text-yellow-500'
                      }`} />
                      <label className={`font-semibold ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>Confirm New Password</label>
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        isDark
                          ? 'border-gray-600 bg-gray-600 text-gray-100 focus:ring-yellow-400 focus:border-yellow-400'
                          : 'border-gray-300 bg-white text-gray-800 focus:ring-yellow-300 focus:border-yellow-400'
                      }`}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Changing...
                    </>
                  ) : (
                    <>
                      <FaKey />
                      Change Password
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Additional Info */}
            <div className={`mt-8 p-6 rounded-2xl ${
              isDark ? 'bg-gray-700/30' : 'bg-blue-50'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                isDark ? 'text-gray-100' : 'text-gray-800'
              }`}>Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>User ID</p>
                  <p className={`font-mono text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-800'
                  }`}>{user.uid}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Account Type</p>
                  <p className={`font-semibold capitalize ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>{role || 'user'}</p>
                </div>
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Email Verified</p>
                  <p className={`font-semibold ${
                    user.emailVerified ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>Member Since</p>
                  <p className={`font-semibold ${
                    isDark ? 'text-gray-300' : 'text-gray-800'
                  }`}>
                    {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;