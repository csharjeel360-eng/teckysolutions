import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { generateSlug } from '../../utils/slugify';
import productService from '../../services/productService';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
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
          if (res.success) setProduct(res.product);
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
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1">
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <span>Category: {product.category?.name || '—'}</span>
              <span>•</span>
              <span>Type: {product.type || 'product'}</span>
              {product.isFeatured && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Featured</span>}
            </div>

            <div className="mb-4">
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.images.map((img, i) => (
                    <img key={i} src={img.url} alt={`${product.title} ${i+1}`} className="w-full h-56 object-cover rounded" />
                  ))}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded" />
              )}
            </div>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />

            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Key Features</h3>
                <ul className="list-disc ml-5 mt-2">
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}

            {product.integrations && product.integrations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Integrations</h3>
                <p className="text-sm text-gray-700">{product.integrations.join(', ')}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((t, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80 p-4 border rounded-md flex-shrink-0">
            <div className="mb-4">
              <div className="text-sm text-gray-600">Price</div>
              <div className="text-2xl font-bold">{product.price ? `$${Number(product.price).toFixed(2)}` : '—'}</div>
              {product.originalPrice && <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>}
            </div>

            {product.externalLink && (
              <a href={product.externalLink} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">Visit Official Site</a>
            )}

            {/* Add to Cart button */}
            {!product.externalLink && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      navigate('/signup');
                      return;
                    }
                    try {
                      setIsProcessing(true);
                      await addToCart(product, 1);
                      navigate('/cart');
                    } catch (err) {
                      // ignore - useCart handles errors
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  disabled={isProcessing || (product.stock !== undefined && product.stock <= 0)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded disabled:opacity-60"
                >
                  {isProcessing ? 'Adding…' : 'Add to Cart'}
                </button>
              </div>
            )}

            {product.affiliateSource && (
              <div className="mt-3 text-xs text-gray-600">Affiliate: {product.affiliateSource}{product.affiliateId ? ` • ${product.affiliateId}` : ''}</div>
            )}

            <div className="mt-4 text-sm text-gray-600">Stock: {product.stock !== undefined ? product.stock : '—'}</div>
            <div className="mt-2 text-sm text-gray-600">Rating: {product.averageRating ? product.averageRating.toFixed(1) : '—'}</div>
            <div className="mt-4">
              <Link to={`/category/${generateSlug(product.category?.name || '')}/listings`} className="text-sm text-blue-600">View more in this category</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
