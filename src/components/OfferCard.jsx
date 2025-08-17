import React from 'react';

const OfferCard = ({ offer }) => {
  return (
    <div className="rounded-2xl p-4 m-2 min-w-[220px] bg-yellow-50 shadow flex flex-col">
      <img src={offer.image || 'https://via.placeholder.com/200x80?text=Offer'} alt={offer.title} className="w-full h-[80px] object-cover rounded-xl mb-2" />
      <h3 className="mb-1 font-semibold text-yellow-700">{offer.title}</h3>
      <p className="text-gray-700 text-sm mb-1">{offer.description}</p>
      <div className="text-xs text-gray-500">Valid till: {offer.validity}</div>
    </div>
  );
};

export default OfferCard; 