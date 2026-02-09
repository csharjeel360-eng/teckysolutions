import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { generateSlug } from '../../utils/slugify';

const JobDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
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
          if (res.success) setJob(res.product);
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
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="lg:flex lg:gap-8">
          <div className="lg:flex-1">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="text-sm text-gray-600 mb-4">Company: {job.companyName || '—'}</div>
            <div>
              {job.images && job.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {job.images.map((img, i) => (
                    <img key={i} src={img.url} alt={`${job.title} ${i+1}`} className="w-full h-48 object-cover rounded" />
                  ))}
                </div>
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            <div className="mt-6 space-y-2">
              <div><strong>Type:</strong> {job.jobType || '—'}</div>
              <div><strong>Location:</strong> {job.location || 'Remote'}</div>
              <div><strong>Experience:</strong> {job.experienceLevel || 'Any'}</div>
              {job.applicationDeadline && <div><strong>Apply by:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}</div>}
            </div>
          </div>

          <aside className="w-full lg:w-80 p-4 border rounded-md flex-shrink-0">
            <div className="mb-4">
              {job.externalLink ? (
                <a href={job.externalLink} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">Apply Now</a>
              ) : (
                <div className="text-sm text-gray-600">No external application link provided</div>
              )}

              {/* Also allow saving/bookmarking the job to cart */}
              <div className="mt-3">
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      navigate('/signup');
                      return;
                    }
                    try {
                      setIsProcessing(true);
                      await addToCart(job, 1);
                      navigate('/cart');
                    } catch (err) {
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded disabled:opacity-60"
                >
                  {isProcessing ? 'Adding…' : 'Save Job'}
                </button>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">Category: {job.category?.name || '—'}</div>
            <div className="mt-2">
              <Link to={`/category/${generateSlug(job.category?.name || '')}/listings`} className="text-sm text-blue-600">View more in this category</Link>
            </div>
            {/* Add to Cart for job (save/bookmark behavior) when no external link */}
            {!job.externalLink && (
              <div className="mt-4">
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      navigate('/signup');
                      return;
                    }
                    try {
                      setIsProcessing(true);
                      await addToCart(job, 1);
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
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
