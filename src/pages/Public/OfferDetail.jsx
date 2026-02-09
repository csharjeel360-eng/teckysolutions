import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { offersAPI } from '../../services/api';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const OfferDetail = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await offersAPI.getById(id);
        if (mounted) {
          if (res?.data) setOffer(res.data);
          else setError('Offer not found');
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <LoadingSpinner showBrand={true} />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!offer) return <div className="p-6">Offer not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{offer.title}</h1>
        <div className="mb-4 text-sm text-gray-600">Network: {offer.network}</div>
        {offer.images && offer.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {offer.images.map((img, i) => (
              <img key={i} src={img.url} alt={`${offer.title} ${i+1}`} className="w-full h-48 object-cover rounded" />
            ))}
          </div>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: offer.description }} />
        <div className="mt-6">
          <p><strong>Commission:</strong> {offer.commission} ({offer.commissionType})</p>
          <p><strong>Start:</strong> {offer.startDate ? new Date(offer.startDate).toLocaleDateString() : '—'}</p>
          <p><strong>End:</strong> {offer.endDate ? new Date(offer.endDate).toLocaleDateString() : '—'}</p>
          <a href={offer.trackingUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded">Visit Offer</a>
        </div>
      </div>
    </div>
  );
};

export default OfferDetail;
