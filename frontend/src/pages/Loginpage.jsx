import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Loginpage.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Loginpage = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle login on form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login initiated');  // Log for debugging
  
    try {
      const response = await axios.post(
        'https://hub-cde3.onrender.com/api/user/login', 
        { email, password }
      );
      console.log('Response:', response.data);  // Debug API response
    
      // Destructure safely from response
      const { token, username, email: userEmail, createdAt } = response.data;
      console.log('Extracted:', { token, username, userEmail, createdAt });
    
      // Save data to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('createdAt', createdAt);
      console.log('CreatedAt:', createdAt);
      
      toast.success('Login Successful!');
      
      // Update state in App.js via prop
      if (setAuthToken) setAuthToken(token);
      
      // Navigate to home page after a delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login Failed! Check your credentials.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-card">
        <h2 className="login-heading">Login</h2>
        <form className="form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-fieldl"
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-fieldl"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="register-txt">
          Not a member?{' '}
          <Link to="/register" className="register-btn">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
