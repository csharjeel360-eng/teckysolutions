/**
 * Public Page Schemas Configuration
 * Contains meta titles, descriptions, and JSON-LD structured data for all public pages
 * Usage: Import and use with the useSEO hook in each page component
 */

const BASE_URL = 'https://teckysolutions.com';
const SITE_NAME = 'TeckySolutions';
const SITE_LOGO = `${BASE_URL}/logo.png`;

/**
 * Home Page Configuration
 */
export const homePageConfig = {
  title: 'TeckySolutions - Best AI Tools, Software & Tech Resources for Digital Growth',
  description: 'Discover curated AI tools, productivity software, SaaS platforms & expert tech blogs. Compare software solutions, read honest reviews & boost your business growth. Trusted by 10,000+ users.',
  url: BASE_URL,
  image: `${BASE_URL}/og-home.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": BASE_URL,
    "description": "Curated AI tools, software reviews, and tech resources for digital growth",
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": SITE_LOGO
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/?s={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
};

/**
 * Categories Page Configuration
 */
export const categoriesPageConfig = {
  title: 'Software Categories - Find the Right Tool for Your Needs | TeckySolutions',
  description: 'Explore our comprehensive category collection of AI tools, productivity software, SaaS platforms, and business solutions. Filter by needs to find the perfect tool for your workflow.',
  url: `${BASE_URL}/categories`,
  image: `${BASE_URL}/og-categories.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Software Categories",
    "description": "Browse curated software categories including AI tools, productivity apps, and SaaS solutions",
    "url": `${BASE_URL}/categories`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Listings Page Configuration (General)
 */
export const listingsPageConfig = {
  title: 'Software & Tools Directory - Compare & Review Solutions | TeckySolutions',
  description: 'Browse our complete directory of software solutions, AI tools, and SaaS platforms. Read reviews, compare features, and find the best tools for your business needs.',
  url: `${BASE_URL}/listings`,
  image: `${BASE_URL}/og-listings.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Software Listings",
    "description": "Comprehensive directory of software tools and solutions with detailed reviews",
    "url": `${BASE_URL}/listings`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Listing Detail Page Configuration Generator
 * Use this function to generate schema for individual listings
 */
export const generateListingDetailSchema = (listing) => {
  const {
    title = 'Untitled Listing',
    slug = '',
    description = '',
    image = '',
    pricing = 'Unknown',
    rating = 0,
    reviewCount = 0,
    category = ''
  } = listing || {};

  return {
    title: `${title} - Features, Pricing & Reviews | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Detailed review and features of ${title}. Check pricing, features, and user reviews.`,
    url: `${BASE_URL}/listings/${slug}`,
    image: image || `${BASE_URL}/og-default.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "url": `${BASE_URL}/listings/${slug}`,
      "description": description,
      "image": image,
      "category": category,
      ...(pricing && {
        "offers": {
          "@type": "Offer",
          "price": pricing,
          "priceCurrency": "USD"
        }
      }),
      ...(rating > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "reviewCount": reviewCount || 0
        }
      })
    }
  };
};

/**
 * Products Page Configuration (if different from Listings)
 */
export const productsPageConfig = {
  title: 'Digital Products - Software Solutions & Tools | TeckySolutions',
  description: 'Explore our curated selection of digital products including software solutions, digital tools, and SaaS applications. Find high-quality products with verified reviews.',
  url: `${BASE_URL}/products`,
  image: `${BASE_URL}/og-products.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Digital Products",
    "description": "Collection of verified digital products and software solutions",
    "url": `${BASE_URL}/products`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Product Detail Page Configuration Generator
 */
export const generateProductDetailSchema = (product) => {
  const {
    title = 'Untitled Product',
    slug = '',
    description = '',
    image = '',
    price = 'Contact for pricing',
    rating = 0,
    reviewCount = 0
  } = product || {};

  return {
    title: `${title} - Buy & Review | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Discover ${title}. Features, pricing information, and customer reviews included.`,
    url: `${BASE_URL}/product/${slug}`,
    image: image || `${BASE_URL}/og-default.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "url": `${BASE_URL}/product/${slug}`,
      "description": description,
      "image": image,
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "USD"
      },
      ...(rating > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "reviewCount": reviewCount || 0
        }
      })
    }
  };
};

/**
 * Software Page Configuration
 */
export const softwarePageConfig = {
  title: 'Software Solutions - Enterprise & Business Tools | TeckySolutions',
  description: 'Discover powerful software solutions for your business. Compare enterprise tools, SaaS platforms, and business applications with detailed reviews and pricing information.',
  url: `${BASE_URL}/software`,
  image: `${BASE_URL}/og-software.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Software Solutions",
    "description": "Enterprise and business software solutions with comprehensive reviews",
    "url": `${BASE_URL}/software`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Software Detail Page Configuration Generator
 */
export const generateSoftwareDetailSchema = (software) => {
  const {
    title = 'Untitled Software',
    slug = '',
    description = '',
    image = '',
    features = [],
    rating = 0,
    reviewCount = 0
  } = software || {};

  return {
    title: `${title} - Features, Pricing & Reviews | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Complete review of ${title} software. Check features, pricing, and user ratings.`,
    url: `${BASE_URL}/software/${slug}`,
    image: image || `${BASE_URL}/og-default.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": title,
      "url": `${BASE_URL}/software/${slug}`,
      "description": description,
      "image": image,
      "applicationCategory": "Business Software",
      ...(features.length > 0 && {
        "featureList": features.join(", ")
      }),
      ...(rating > 0 && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rating,
          "reviewCount": reviewCount || 0
        }
      })
    }
  };
};

/**
 * Jobs Page Configuration (if available)
 */
export const jobsPageConfig = {
  title: 'Tech Jobs & Opportunities - Careers at TeckySolutions | TeckySolutions',
  description: 'Explore exciting career opportunities in tech, AI, and software development. Find your next job and grow your career with us.',
  url: `${BASE_URL}/jobs`,
  image: `${BASE_URL}/og-jobs.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "name": "Tech Jobs & Opportunities",
    "url": `${BASE_URL}/jobs`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Job Detail Page Configuration Generator
 */
export const generateJobDetailSchema = (job) => {
  const {
    title = 'Untitled Position',
    slug = '',
    description = '',
    jobLocation = 'Remote',
    salary = '',
    jobType = 'Full-time'
  } = job || {};

  return {
    title: `${title} - Job Opportunity at TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Apply now for ${title} position. Location: ${jobLocation}, Type: ${jobType}`,
    url: `${BASE_URL}/job/${slug}`,
    image: `${BASE_URL}/og-job.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": title,
      "description": description,
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobLocation
        }
      },
      "employmentType": jobType,
      ...(salary && {
        "baseSalary": {
          "@type": "PriceSpecification",
          "currency": "USD",
          "price": salary
        }
      }),
      "hiringOrganization": {
        "@type": "Organization",
        "name": SITE_NAME,
        "logo": SITE_LOGO
      }
    }
  };
};

/**
 * Offers Page Configuration (if available)
 */
export const offersPageConfig = {
  title: 'Special Offers & Deals - Save on Software & Tools | TeckySolutions',
  description: 'Check out our latest special offers and exclusive deals on premium software and tools. Save money while getting quality solutions for your business.',
  url: `${BASE_URL}/offers`,
  image: `${BASE_URL}/og-offers.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Special Offers",
    "description": "Exclusive offers and deals on premium software solutions",
    "url": `${BASE_URL}/offers`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Offer Detail Page Configuration Generator
 */
export const generateOfferDetailSchema = (offer) => {
  const {
    title = 'Untitled Offer',
    id = '',
    description = '',
    image = '',
    price = '',
    originalPrice = '',
    expiryDate = ''
  } = offer || {};

  return {
    title: `${title} - Limited Time Offer | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Special offer on ${title}. Save with exclusive deals and pricing.`,
    url: `${BASE_URL}/offer/${id}`,
    image: image || `${BASE_URL}/og-default.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Offer",
      "name": title,
      "description": description,
      "url": `${BASE_URL}/offer/${id}`,
      "image": image,
      "priceCurrency": "USD",
      "price": price,
      ...(originalPrice && {
        "priceCurrency": "USD",
        "price": originalPrice
      }),
      ...(expiryDate && {
        "priceValidUntil": expiryDate
      })
    }
  };
};

/**
 * Blogs Page Configuration
 */
export const blogsPageConfig = {
  title: 'Tech Blog - AI, Software & Digital Growth Resources | TeckySolutions',
  description: 'Read expert insights on AI tools, software reviews, business technology, and digital marketing. Stay updated with latest tech trends and tutorials.',
  url: `${BASE_URL}/blogs`,
  image: `${BASE_URL}/og-blogs.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "TeckySolutions Blog",
    "description": "Expert technology blog covering AI, software, and digital growth",
    "url": `${BASE_URL}/blogs`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": SITE_LOGO
    }
  }
};

/**
 * Blog Detail Page Configuration Generator
 */
export const generateBlogDetailSchema = (blog) => {
  const {
    title = 'Untitled Article',
    slug = '',
    description = '',
    content = '',
    image = '',
    author = 'TeckySolutions',
    publishedDate = new Date().toISOString(),
    modifiedDate = new Date().toISOString(),
    readTime = 5
  } = blog || {};

  return {
    title: `${title} - Tech Blog | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || description,
    url: `${BASE_URL}/blog/${slug}`,
    image: image || `${BASE_URL}/og-blog.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": image,
      "url": `${BASE_URL}/blog/${slug}`,
      "datePublished": publishedDate,
      "dateModified": modifiedDate,
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_NAME,
        "logo": {
          "@type": "ImageObject",
          "url": SITE_LOGO
        }
      },
      "articleBody": content,
      "wordCount": content ? content.split(' ').length : 0,
      "timeRequired": `PT${readTime}M`
    }
  };
};

/**
 * Services Page Configuration
 */
export const servicesPageConfig = {
  title: 'Services - Expert Tech Consulting & Solutions | TeckySolutions',
  description: 'Explore our professional services including consulting, implementation, training, and support for software solutions and digital transformation.',
  url: `${BASE_URL}/services`,
  image: `${BASE_URL}/og-services.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": SITE_NAME,
    "description": "Professional tech consulting and implementation services",
    "url": `${BASE_URL}/services`,
    "areaServed": "Worldwide",
    "serviceType": ["Consulting", "Implementation", "Training", "Support"]
  }
};

/**
 * Service Detail Page Configuration Generator
 */
export const generateServiceDetailSchema = (service) => {
  const {
    title = 'Untitled Service',
    slug = '',
    description = '',
    image = '',
    price = '',
    duration = ''
  } = service || {};

  return {
    title: `${title} - Professional Services | TeckySolutions`,
    description: `${description.substring(0, 155)}...` || `Professional ${title} service from TeckySolutions. Expert consulting and implementation.`,
    url: `${BASE_URL}/services/${slug}`,
    image: image || `${BASE_URL}/og-default.jpg`,
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": title,
      "description": description,
      "image": image,
      "url": `${BASE_URL}/services/${slug}`,
      "provider": {
        "@type": "Organization",
        "name": SITE_NAME,
        "logo": SITE_LOGO
      },
      ...(price && {
        "price": price,
        "priceCurrency": "USD"
      }),
      ...(duration && {
        "duration": duration
      })
    }
  };
};

/**
 * Cart Page Configuration
 */
export const cartPageConfig = {
  title: 'Shopping Cart - Software & Tools | TeckySolutions',
  description: 'Review and manage your shopping cart. Complete your purchase of software solutions and digital tools from TeckySolutions.',
  url: `${BASE_URL}/cart`,
  image: `${BASE_URL}/og-cart.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "BuyAction",
    "name": "Shopping Cart",
    "url": `${BASE_URL}/cart`
  }
};

/**
 * Contact Page Configuration
 */
export const contactPageConfig = {
  title: 'Contact Us - Get Support & Inquiries | TeckySolutions',
  description: 'Get in touch with our team. Have questions about our software solutions? Contact us for support, partnerships, or inquiries.',
  url: `${BASE_URL}/contact`,
  image: `${BASE_URL}/og-contact.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us",
    "description": "Contact TeckySolutions for support and inquiries",
    "url": `${BASE_URL}/contact`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@teckysolutions.com"
      }
    }
  }
};

/**
 * Privacy Policy Page Configuration
 */
export const privacyPolicyConfig = {
  title: 'Privacy Policy - TeckySolutions',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal data at TeckySolutions.',
  url: `${BASE_URL}/privacy-policy`,
  image: `${BASE_URL}/og-default.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy",
    "description": "Privacy policy and data protection information",
    "url": `${BASE_URL}/privacy-policy`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * Terms of Service Page Configuration
 */
export const termsOfServiceConfig = {
  title: 'Terms of Service - TeckySolutions',
  description: 'Review our terms and conditions for using TeckySolutions. Understand your rights and responsibilities as a user.',
  url: `${BASE_URL}/terms-of-service`,
  image: `${BASE_URL}/og-default.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms of Service",
    "description": "Terms and conditions for using TeckySolutions",
    "url": `${BASE_URL}/terms-of-service`,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  }
};

/**
 * 404 Not Found Page Configuration
 */
export const notFoundPageConfig = {
  title: '404 - Page Not Found | TeckySolutions',
  description: 'The page you are looking for could not be found. Please check the URL or navigate back to the homepage.',
  url: `${BASE_URL}/404`,
  image: `${BASE_URL}/og-default.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "404 - Not Found",
    "description": "The requested page could not be found",
    "url": `${BASE_URL}/404`
  }
};

/**
 * Unauthorized Page Configuration
 */
export const unauthorizedPageConfig = {
  title: 'Unauthorized - Access Denied | TeckySolutions',
  description: 'You do not have permission to access this resource. Please log in or contact support for assistance.',
  url: `${BASE_URL}/unauthorized`,
  image: `${BASE_URL}/og-default.jpg`,
  schema: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Unauthorized",
    "description": "Access denied page",
    "url": `${BASE_URL}/unauthorized`
  }
};

/**
 * Export all configurations as a map for easy access
 */
export const pageConfigMap = {
  '/': homePageConfig,
  '/categories': categoriesPageConfig,
  '/listings': listingsPageConfig,
  '/products': productsPageConfig,
  '/software': softwarePageConfig,
  '/jobs': jobsPageConfig,
  '/offers': offersPageConfig,
  '/blogs': blogsPageConfig,
  '/services': servicesPageConfig,
  '/cart': cartPageConfig,
  '/contact': contactPageConfig,
  '/privacy-policy': privacyPolicyConfig,
  '/terms-of-service': termsOfServiceConfig,
  '/404': notFoundPageConfig,
  '/unauthorized': unauthorizedPageConfig
};

/**
 * Utility function to get page config by path
 */
export const getPageConfig = (path) => {
  return pageConfigMap[path] || homePageConfig;
};

export default {
  homePageConfig,
  categoriesPageConfig,
  listingsPageConfig,
  generateListingDetailSchema,
  productsPageConfig,
  generateProductDetailSchema,
  softwarePageConfig,
  generateSoftwareDetailSchema,
  jobsPageConfig,
  generateJobDetailSchema,
  offersPageConfig,
  generateOfferDetailSchema,
  blogsPageConfig,
  generateBlogDetailSchema,
  servicesPageConfig,
  generateServiceDetailSchema,
  cartPageConfig,
  contactPageConfig,
  privacyPolicyConfig,
  termsOfServiceConfig,
  notFoundPageConfig,
  unauthorizedPageConfig,
  pageConfigMap,
  getPageConfig
};
