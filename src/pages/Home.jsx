// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Let's work together to create stunning websites, improve your SEO rankings, 
            and drive real results for your business.
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Home;