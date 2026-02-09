import { useEffect } from 'react';

export const useSEO = ({ title, description, url, image, schema }) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }

    // Update canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    // Update Open Graph tags
    const updateMetaTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    if (title) {
      updateMetaTag('og:title', title);
    }
    if (description) {
      updateMetaTag('og:description', description);
    }
    if (url) {
      updateMetaTag('og:url', url);
    }
    if (image) {
      updateMetaTag('og:image', image);
    }
    
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'TeckySolutions');

    // Update Twitter tags
    const updateTwitterTag = (name, content) => {
      let tag = document.querySelector(`meta[name="twitter:${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = `twitter:${name}`;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateTwitterTag('card', 'summary_large_image');
    if (title) updateTwitterTag('title', title);
    if (description) updateTwitterTag('description', description);
    if (image) updateTwitterTag('image', image);

    // Update structured data (JSON-LD)
    if (schema) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    }
  }, [title, description, url, image, schema]);
};

export default useSEO;
