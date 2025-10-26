// src/pages/About.jsx
import React from 'react';

const About = () => {
  const team = [
    {
      name: 'Sharjeel Tariq',
      role: 'CEO & Founder',
      bio: '10+ years in digital marketing and web development',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Ammar Minhas',
      role: 'SEO Specialist',
      bio: 'Expert in search engine optimization and content strategy',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Israr Ahmed',
      role: 'Lead Developer',
      bio: 'Full-stack developer specializing in e-commerce solutions',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Zohaib Khan',
      role: 'Digital Marketing Manager',
      bio: 'PPC and social media advertising expert',
      image: '/api/placeholder/300/300'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About DigitalPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're a team of passionate digital experts dedicated to helping 
            businesses thrive in the online world through innovative solutions 
            and proven strategies.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To empower businesses of all sizes with cutting-edge digital solutions 
              that drive growth, enhance online presence, and deliver measurable results. 
              We believe in building long-term partnerships based on trust and success.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              To be the leading digital agency that transforms how businesses 
              connect with their audience online, creating exceptional digital 
              experiences that inspire and convert.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every project, delivering quality 
                that exceeds expectations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We stay ahead of digital trends and leverage the latest 
                technologies for optimal results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Partnership</h3>
              <p className="text-gray-600">
                We build lasting relationships with our clients, working 
                together to achieve their goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;