import React, { useEffect, useState } from 'react';
import { getAllAds } from '../utils/api';
// import { Head } from 'react-head'; // এই লাইন মুছে ফেললাম

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllAds()
      .then(res => {
        const approved = (res.data || []).filter(ad => ad.status === 'approved');
        setOffers(approved);
        setLoading(false);
      })
      .catch(() => {
        setError('অফার লোড করা যায়নি');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-10 text-blue-500">লোড হচ্ছে...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      <title>Offers | Local Market Tracker</title>
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-700 mb-8 text-center tracking-tight">
          বিশেষ অফারসমূহ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.length ? offers.map((offer, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 flex flex-col items-center">
              <img src={offer.image} alt={offer.title} className="w-full h-20 object-cover rounded mb-3 shadow" />
              <h3 className="mb-1 font-bold text-yellow-700 text-lg text-center">{offer.title}</h3>
              <p className="text-gray-700 text-center mb-2">{offer.description || offer.desc}</p>
                <div className="text-xs text-gray-500">Valid till: {offer.validity || 'N/A'}</div>
                <div className="text-xs text-gray-400">Uploaded: {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('bn-BD') : 'N/A'}</div>
            </div>
          )) : (
            <div className="col-span-full text-center text-yellow-500 font-semibold py-8">কোনো অফার পাওয়া যায়নি</div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Offers; 