import React, { useState } from 'react';
import './styles.css'; // Import CSS for styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Button (Visible only on Mobile) */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar Panel */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times; {/* Close button for mobile */}
        </button>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/progress">Progress</a></li>
          <li><a href="/trainingprogram">Training Program</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </div>

      {/* Overlay for Mobile (Closes sidebar when clicked outside) */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default Sidebar;