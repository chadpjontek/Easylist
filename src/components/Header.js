import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  // Get/set state of nav
  const [isNavOpen, setIsNavOpen] = useState(false);
  // Open nav
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };
  // Close nav
  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header>
      <nav>
        <div className="nav-container">
          <div className="logo"><Link exact to='/' onClick={closeNav}><span role='img' aria-label='checkmark emoji'>✅</span> EasyList.link</Link></div>
          <div onClick={toggleNav} className="hamburger">
            <div className={isNavOpen ? 'line open' : 'line'}></div>
            <div className={isNavOpen ? 'line open' : 'line'}></div>
            <div className={isNavOpen ? 'line open' : 'line'}></div>
          </div>
          <ul className={isNavOpen ? 'nav-links open' : 'nav-links'}>
            <li><Link to='/signin' onClick={toggleNav}>Sign in</Link></li>
            <li><Link to='/lists/create' onClick={toggleNav}>Create a list</Link></li>
            <li><Link to='/lists' onClick={toggleNav}>View your lists</Link></li>
            <li><Link to='/donate' onClick={toggleNav}>Donate <span role='img' aria-label='heart emoji'>❤️</span></Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
