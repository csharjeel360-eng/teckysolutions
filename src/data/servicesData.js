// Data for services
const servicesData = [
  {
    id: 1,
    slug: 'website-development',
    name: 'Website Development',
    shortDescription: 'Professional website design & development',
    description: 'We create custom, responsive websites tailored to your business needs. From HTML/CSS to advanced frameworks, we build fast, secure, and scalable web solutions.',
    features: [
      'Custom Website Design',
      'Responsive & Mobile-First',
      'Fast Loading Performance',
      'SEO Optimized',
      'Secure & SSL Enabled',
      'Easy Content Management',
      'E-Commerce Ready',
      'Analytics Integration'
    ],
    icon: '🌐',
    image: '/website-development-services.png',
    price: 'Custom Quote',
    deliveryTime: '4-8 Weeks',
    banners: [
      {
        id: 1,
        title: 'Responsive Web Design',
        description: 'Beautiful designs that work on all devices',
        image: '/banner/custom-website-development-service-banner.jpeg'
      },
      {
        id: 2,
        title: 'Custom Website Development',
        description: 'Built with the latest web technologies',
        image: '/banner/custom-website-development-service-banner.jpeg'
      },
      {
        id: 3,
        title: 'Fast & Secure',
        description: 'Optimized for speed and security',
        image: '/banner/custom-website-development-service-banner.jpeg'
      },
      {
        id: 4,
        title: 'Complete Support',
        description: 'Support and maintenance included',
        image: '/banner/custom-website-development-service-banner.jpeg'
      }
    ],
    detailsList: [
      'Professional consultation & planning',
      'UI/UX design mockups',
      'Frontend development with latest technologies',
      'Backend API development',
      'Database design & implementation',
      'Testing & quality assurance',
      'Deployment & hosting setup',
      '30 days free support'
    ]
  },
  {
    id: 2,
    slug: 'shopify-store-creation',
    name: 'Shopify Store Creation',
    shortDescription: 'Build your online store with Shopify',
    description: 'Launch your e-commerce business with a fully functional Shopify store. We handle setup, customization, and optimization for maximum sales.',
    features: [
      'Shopify Store Setup',
      'Theme Customization',
      'Product Management',
      'Payment Gateway Integration',
      'Inventory Management',
      'Email Marketing Setup',
      'Analytics & Reporting',
      'Mobile Optimized'
    ],
    icon: '🛍️',
    image: '/shopify-store-creation-services.png',
    price: 'Custom Quote',
    deliveryTime: '2-4 Weeks',
    banners: [
      {
        id: 1,
        title: 'Professional Store Setup',
        description: 'Complete Shopify store configuration',
        image: '/banner/shopify-store-creation-service-banner.jpeg'
      },
      {
        id: 2,
        title: 'Payment & Checkout',
        description: 'Secure payments with multiple gateways',
        image: '/banner/shopify-store-creation-service-banner.jpeg'
      },
      {
        id: 3,
        title: 'Inventory Management',
        description: 'Easy product and inventory management',
        image: '/banner/shopify-store-creation-service-banner.jpeg'
      },
      {
        id: 4,
        title: 'Mobile Commerce',
        description: 'Optimized for mobile shopping experience',
        image: '/banner/shopify-store-creation-service-banner.jpeg'
      }
    ],
    detailsList: [
      'Store design & layout customization',
      'Product listing & categorization',
      'Payment gateway setup (Stripe, PayPal, etc)',
      'Shipping configuration',
      'Tax setup for your regions',
      'Email notification templates',
      'App integrations (reviews, analytics, etc)',
      'Staff training & documentation',
      '30 days free support'
    ]
  },
  {
    id: 3,
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    shortDescription: 'Grow your business with digital marketing',
    description: 'Comprehensive digital marketing strategies including social media, content marketing, PPC advertising, and more to reach your target audience.',
    features: [
      'Social Media Marketing',
      'Content Marketing',
      'Google Ads (PPC)',
      'Email Campaigns',
      'Influencer Outreach',
      'Brand Building',
      'Lead Generation',
      'Monthly Reporting'
    ],
    icon: '📱',
    image: '/digital-marketing-services.png',
    price: 'Custom Quote',
    deliveryTime: 'Ongoing',
    banners: [
      {
        id: 1,
        title: 'Social Media Strategy',
        description: 'Grow your social media presence',
        image: '/banner/data-driven-digital-marketing-service-banner.jpeg'
      },
      {
        id: 2,
        title: 'Content Marketing',
        description: 'Engage your audience with quality content',
        image: '/banner/data-driven-digital-marketing-service-banner.jpeg'
      },
      {
        id: 3,
        title: 'Paid Advertising',
        description: 'Targeted campaigns for maximum ROI',
        image: '/banner/data-driven-digital-marketing-service-banner.jpeg'
      },
      {
        id: 4,
        title: 'Performance Analytics',
        description: 'Track and optimize your campaigns',
        image: '/banner/data-driven-digital-marketing-service-banner.jpeg'
      }
    ],
    detailsList: [
      'Marketing strategy development',
      'Social media account management',
      'Content calendar creation',
      'Paid advertising campaigns',
      'Email marketing campaigns',
      'Lead generation funnels',
      'Brand identity development',
      'Weekly/Monthly performance reports',
      'A/B testing & optimization',
      'Community management'
    ]
  },
  {
    id: 4,
    slug: 'seo-optimization',
    name: 'SEO & SEM',
    shortDescription: 'Rank higher on Google search results',
    description: 'Improve your website visibility with expert SEO services. We optimize your site for search engines and drive organic traffic to boost conversions.',
    features: [
      'Keyword Research',
      'On-Page Optimization',
      'Technical SEO',
      'Link Building',
      'Local SEO',
      'Content Optimization',
      'Rank Tracking',
      'Monthly Reports'
    ],
    icon: '🔍',
    image: '/seo-sem-services.png',
    price: 'Custom Quote',
    deliveryTime: '3-6 Months',
    banners: [
      {
        id: 1,
        title: 'Keyword Research',
        description: 'Data-driven keyword strategy',
        image: '/banner/seo-sem-services-ranking-growth-banner.jpeg'
      },
      {
        id: 2,
        title: 'On-Page Optimization',
        description: 'Optimize your pages for search engines',
        image: '/banner/seo-sem-services-ranking-growth-banner.jpeg'
      },
      {
        id: 3,
        title: 'Link Building',
        description: 'Build quality backlinks for authority',
        image: '/banner/seo-sem-services-ranking-growth-banner.jpeg'
      },
      {
        id: 4,
        title: 'Rank Tracking',
        description: 'Monitor your rankings and progress',
        image: '/banner/seo-sem-services-ranking-growth-banner.jpeg'
      }
    ],
    detailsList: [
      'Comprehensive SEO audit',
      'Keyword research & strategy',
      'On-page optimization',
      'Technical SEO improvements',
      'Meta tags & structured data',
      'Backlink analysis & building',
      'Local SEO optimization',
      'Content strategy development',
      'Rank tracking & monitoring',
      'Monthly optimization reports'
    ]
  }
];

export default servicesData;
