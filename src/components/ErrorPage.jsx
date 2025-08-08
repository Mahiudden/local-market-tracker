import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 px-4">
      <div className="text-7xl mb-4">😕</div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-2 text-center">404 - পেজ খুঁজে পাওয়া যায়নি</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">দুঃখিত, আপনি যে পেজটি খুঁজছেন তা নেই বা সরানো হয়েছে।</p>
      <button onClick={()=>navigate('/')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 font-bold transition">হোমে ফিরে যান</button>
    </div>
  );
};

export default ErrorPage; 