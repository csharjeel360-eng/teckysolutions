import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { generateSlug } from '../../utils/slugify';

const SoftwareDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productService.getBySlug(slug);
        if (mounted) {
          if (res.success) setItem(res.product);
          else setError(res.error || 'Not found');
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) return <LoadingSpinner showBrand={true} />;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!item) return <div className="p-6">Software not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="lg:flex lg:gap-8">
          <div className="lg:flex-1">
            <h1 className="text-3xl font-bold mb-3">{item.title}</h1>
            <div className="mb-4 text-sm text-gray-600">Platform: {(item.platform || []).join(', ') || '—'}</div>
            <div className="mb-4">
              {item.images && item.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {item.images.map((img, i) => (
                    <img key={i} src={img.url} alt={`${item.title} ${i+1}`} className="w-full h-48 object-cover rounded" />
                  ))}
                </div>
              ) : null}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>

            {item.features && item.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Key Features</h3>
                <ul className="list-disc ml-5 mt-2">
                  {item.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {item.integrations && item.integrations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Integrations</h3>
                <p className="text-sm text-gray-700">{item.integrations.join(', ')}</p>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 p-4 border rounded-md flex-shrink-0">
            <div className="mb-4">
              <div className="text-sm text-gray-600">Pricing</div>
              <div className="text-2xl font-bold">{item.price ? `$${Number(item.price).toFixed(2)}` : (item.pricingType === 'free' ? 'Free' : '—')}</div>
            </div>

            {item.externalLink && (
              <a href={item.externalLink} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">Visit Official Site</a>
            )}

            {/* Always show Add to Cart button (auth-gated) */}
            <div className="mt-4">
              <button
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate('/signup');
                    return;
                  }
                  try {
                    setIsProcessing(true);
                    await addToCart(item, 1);
                    navigate('/cart');
                  } catch (err) {
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded disabled:opacity-60"
              >
                {isProcessing ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">Category: {item.category?.name || '—'}</div>
            <div className="mt-2 text-sm text-gray-600">Tags: {(item.tags || []).join(', ') || '—'}</div>
            <div className="mt-4">
              <Link to={`/category/${generateSlug(item.category?.name || '')}/listings`} className="text-sm text-blue-600">View more in this category</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SoftwareDetail;
