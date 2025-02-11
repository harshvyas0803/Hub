import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../../assets/Hubpurple.png';
import { useBlog } from "../../context/BlogContext";

const Navbar = () => {
  const { user, setUser } = useBlog();
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  // Retrieve token and username from localStorage on component mount.
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    console.log('Stored username:', storedUsername); // Should log the correct username

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
    localStorage.removeItem('username'); // remove the username as well
    setUser(null);
    setToken('');
    navigate('/')
  };

  return (
    <header>
      <div className="Parent_navbar">
        <Link to="/">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </Link>

        <nav className="options">
          <Link to="/" className="option">Home</Link>
          <Link to="/createblog" className="option blog">Create new blog</Link>
          {/* <Link to="/about" className="option">About</Link> */}
        </nav>

        {token ? (
          <>
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
