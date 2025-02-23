import React, { useState, useContext } from 'react'; // Add useContext
import logo from '../images/logo.png';
import './Sidebar.css'; // Import the CSS for styling
import { UserContext } from './UserContext'; // Import UserContext

const Sidebar = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle sidebar visibility
  const { username } = useContext(UserContext); // Get username from UserContext

  // Toggle sidebar visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-container">
      {/* Top Bar */}
      <div className="top-bar">
        {/* Logo */}
        <div className="logo">
          <a href='/home'>
            <img src={logo} alt="MyLogo" style={{ height: '35px', width: 'auto' }} />
          </a>
        </div>
        {/* Hamburger Button */}
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li><a href='/home'>Home</a></li> {/* Correctly passing the url variable */}
          <li><a href="/progress">Progress</a></li>
          <li><a href="/trainingprogram">Training Program</a></li>
          <li><a href="/profile">Profile</a></li>
          {/* Conditionally render the Clients link */}
          {username === 'rumi' && (
            <li><a href="/clients">Clients</a></li>
          )}
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      {/* Main Content (Injected via props.children) */}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;