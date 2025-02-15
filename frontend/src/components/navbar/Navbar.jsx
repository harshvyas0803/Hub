import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../../assets/Hubpurple.png';
import { useBlog } from "../../context/BlogContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import RightSidebar from '../rightsidebar/RightSidebar';

const Navbar = () => {
  const { user, setUser } = useBlog();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Retrieve token and username from localStorage on component mount.
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    console.log('Stored username:', storedUsername);

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUsername) {
      setUser({ name: storedUsername });
    }
  }, [setUser]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setUser(null);
    setToken('');
   
    window.location.reload();
  };

  // Toggle sidebar visibility when the menu icon is clicked.
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // When logo is clicked, also hide sidebar if open.
  const handleLogoClick = () => {
    setSidebarVisible(false);
  };

  return (
    <header>
      <div className="Parent_navbar">
        <Link to="/" onClick={handleLogoClick}>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </Link>

        <nav className="options">
          <Link to="/" className="option">Home</Link>
          <Link to="/createblog" className="option blog">Create a blog</Link>
        </nav>

        <div className="navbar-right">
          {token ? (
            <>
              <span className="welcome-text">Welcome, {user?.name}</span>
              <button onClick={handleLogout}>Logout</button>
              <FontAwesomeIcon 
                icon={faBars} 
                onClick={toggleSidebar} 
                className="menu-icon" 
              />
            </>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </div>

      {sidebarVisible && <RightSidebar />}
    </header>
  );
};

export default Navbar;
