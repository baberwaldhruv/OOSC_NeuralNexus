import React, { useState, useEffect } from 'react';
import './navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If the user scrolls more than 20px, activate the blur background
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-master ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* LEFT: Logo */}
        <div className="navbar-logo">
          <span className="logo-text serif">Contractify</span>
        </div>

        {/* CENTER: Navigation Links */}
        <ul className="navbar-links">
          <li><a href="#why-us" className="nav-link">Why Us</a></li>
          <li><a href="#methodology" className="nav-link">Methodology</a></li>
          <li><a href="#faq" className="nav-link">FAQ</a></li>
        </ul>

        {/* RIGHT: Action Buttons */}
        <div className="navbar-actions">
          <button className="btn-text">Sign In</button>
          <button className="btn-cocoa-nav">Contact a lawyer</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;