import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, MessageCircle, Send, Clock, Globe } from 'lucide-react';
import useSEO from '../../hooks/useSEO';
import { setPageTitle } from '../../utils/slugify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pageTitle = 'Contact Us';

  // Set SEO metadata
  useSEO({
    title: 'Contact Us - Get in Touch with Our Team',
    description: 'Contact Tecky Solutions for web development, digital marketing, and SEO services. Reach us via email, phone, or visit our office in Islamabad.',
    url: window.location.href
  });

  React.useMemo(() => {
    setPageTitle(pageTitle);
  }, [pageTitle]);

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      value: '+92 325 957 9107',
      description: 'Call us for immediate assistance',
      link: 'tel:+923259579107',
      action: 'Call Now'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      value: 'teckysolutions360@gmail.com',
      description: 'Send us your inquiry',
      link: 'mailto:teckysolutions360@gmail.com',
      action: 'Send Email'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location',
      value: 'Islamabad, Pakistan',
      description: 'Suite 501, Blue Area, Islamabad, Pakistan',
      link: 'https://goo.gl/maps/islamabad',
      action: 'View Map'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'WhatsApp',
      value: '+92 325 957 9107',
      description: 'Chat with us on WhatsApp',
      link: 'https://wa.me/923259579107',
      action: 'Chat Now'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      // Send email via Gmail
      const response = await fetch('https://formspree.io/f/xwpekoje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `New Contact Form: ${formData.subject}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Home size={16} /> Home
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">Contact Us</span>
        </div>
      </div>

      {/* Hero Section with banner background */}
      <section
        className="relative overflow-hidden text-white py-16 sm:py-20"
        style={{
          backgroundImage: `url('/homeherobanner/futuristic-tech-hero-banner-dark-blue-teal.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45))' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have a question or ready to start your project? We'd love to hear from you. Reach out to us today!
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 sm:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 group border border-white/10"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-100 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {info.description}
                </p>
                <p className="font-semibold text-gray-100 mb-4">
                  {info.value}
                </p>
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  {info.action}
                  <span>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info Grid */}
      <section className="py-16 sm:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-100 mb-8">Send us a Message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300">
                  <p className="font-semibold">✓ Message sent successfully!</p>
                  <p className="text-sm">We'll get back to you as soon as possible.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300">
                  <p className="font-semibold">✗ {error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-100 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-white/10 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-white/10 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-100 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-white/10 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-100 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your project..."
                    rows="5"
                    className="w-full px-4 py-3 border border-white/10 bg-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1">
              {/* Office Hours */}
              <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-8 mb-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">Office Hours</h3>
                    <p className="text-sm text-gray-300 mt-1">Monday - Friday</p>
                    <p className="font-semibold text-gray-100">9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-300 mt-2">Saturday - Sunday</p>
                    <p className="font-semibold text-gray-100">10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Service Area */}
              <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">Service Coverage</h3>
                    <p className="text-sm text-gray-300 mt-3">
                      We serve clients across Pakistan and internationally. Remote collaboration available worldwide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-6 space-y-3">
                <h3 className="font-bold text-gray-100">Quick Links</h3>
                <Link to="/services" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span>→</span> Our Services
                </Link>
                <Link to="/blogs" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span>→</span> Our Blog
                </Link>
                <a href="https://wa.me/923259579107" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span>→</span> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="py-16 sm:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-100 text-center mb-12">
            Find Us
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded-xl overflow-hidden shadow-lg h-96 border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.8309246449903!2d74.340752!3d33.783739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07e6c0c1d%3A0x123456789!2sBlue%20Area%20Islamabad!5e0!3m2!1sen!2s!4v1640000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Location Details */}
            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md p-8 mb-6 border border-white/10">
                <h3 className="text-2xl font-bold text-gray-100 mb-4">
                  Our Office
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-semibold uppercase">Address</p>
                      <p className="text-lg text-gray-100 font-semibold mt-1">
                        Suite 501, Blue Area
                      </p>
                      <p className="text-gray-300">Islamabad, Pakistan</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold uppercase">Phone</p>
                        <a href="tel:+923259579107" className="text-lg text-gray-100 font-semibold mt-1 hover:text-blue-400 transition-colors">
                          +92 325 957 9107
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-semibold uppercase">Email</p>
                        <a href="mailto:teckysolutions360@gmail.com" className="text-lg text-gray-100 font-semibold mt-1 hover:text-blue-400 transition-colors break-all">
                          teckysolutions360@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl p-6">
                <p className="font-semibold mb-4">Connect With Us</p>
                <div className="space-y-2">
                  <a
                    href="https://wa.me/923259579107"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <MessageCircle size={20} />
                    WhatsApp: +92 325 957 9107
                  </a>
                  <a
                    href="tel:+923259579107"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Phone size={20} />
                    Call: +92 325 957 9107
                  </a>
                  <a
                    href="mailto:teckysolutions360@gmail.com"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Mail size={20} />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-100 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-gray-100 mb-2">What's your response time?</h3>
              <p className="text-gray-300 text-sm">
                We typically respond to inquiries within 24 hours during business days.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-gray-100 mb-2">Do you offer free consultations?</h3>
              <p className="text-gray-300 text-sm">
                Yes! We offer a free initial consultation to discuss your project needs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-gray-100 mb-2">What are your payment terms?</h3>
              <p className="text-gray-300 text-sm">
                We offer flexible payment plans. Contact us to discuss options suitable for you.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10">
              <h3 className="font-bold text-gray-100 mb-2">Do you work with remote clients?</h3>
              <p className="text-gray-300 text-sm">
                Absolutely! We work with clients worldwide and handle everything remotely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
