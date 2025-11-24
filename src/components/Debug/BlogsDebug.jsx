 // components/Debug/BlogsDebug.js
import React from 'react';

 const BlogsDebug = ({ blogs, loading, error, filters, componentName = "Blogs" }) => {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold text-yellow-800 mb-2">{componentName} Debug</h3>
      <div className="text-xs text-yellow-700 space-y-1">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>Error:</strong> {error || 'None'}</div>
        <div><strong>Blogs Count:</strong> {blogs?.length || 0}</div>
        <div><strong>Filters:</strong> {JSON.stringify(filters)}</div>
        <div><strong>Sample Blog:</strong></div>
        <pre className="text-xs mt-1 bg-yellow-200 p-2 rounded">
          {blogs?.[0] ? JSON.stringify({
            id: blogs[0]._id,
            title: blogs[0].title,
            status: blogs[0].status,
            isPublished: blogs[0].isPublished,
            featuredImage: !!blogs[0].featuredImage,
            slug: blogs[0].slug
          }, null, 2) : 'No blogs'}
        </pre>
        <div><strong>All Blogs Status:</strong></div>
        <pre className="text-xs mt-1 bg-yellow-200 p-2 rounded">
          {blogs?.map(blog => ({
            id: blog._id,
            title: blog.title,
            status: blog.status,
            isPublished: blog.isPublished
          })) || 'No blogs'}
        </pre>
      </div>
    </div>
  );
};
export default BlogsDebug;