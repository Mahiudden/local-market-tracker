import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
      <div className="relative flex items-center justify-center mb-6">
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-green-400 opacity-30 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-20 w-20 bg-gradient-to-tr from-blue-500 via-purple-500 to-green-500 shadow-lg flex items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-white opacity-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </span>
      </div>
      <div className="text-xl font-semibold text-gray-700 tracking-wide animate-pulse">লোড হচ্ছে...</div>
    </div>
  );
};

export default Loading; 