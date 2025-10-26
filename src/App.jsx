 // src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import WhatsAppPopup from './pages/WhatsAppPopup'; // Import the WhatsApp component

// Component to handle page titles
const PageTitleHandler = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    const pageTitles = {
      '/': 'TeckySolutions - Home',
      '/about': 'About Us - TeckySolutions',
      '/services': 'Services - TeckySolutions',
      '/contact': 'Contact Us - TeckySolutions',
      '/privacy': 'Privacy Policy - TeckySolutions',
      '/terms': 'Terms & Conditions - TeckySolutions'
    };
    
    document.title = pageTitles[location.pathname] || 'TeckySolutions';
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <PageTitleHandler />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
        <Footer />
        <ScrollToTop />
        <WhatsAppPopup /> {/* Add WhatsApp popup here */}
      </div>
    </Router>
  );
}

export default App;