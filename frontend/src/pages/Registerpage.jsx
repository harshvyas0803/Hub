import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Registerpage.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Registerpage = ({ setAuthToken }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validate input fields before submission
  const validateInputs = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = "Username is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    } else {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
      }
      if (!/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter.";
      }
      if (!/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter.";
      }
      if (!/[0-9]/.test(password)) {
        errors.password = "Password must contain at least one number.";
      }
      if (!/[@$!%*?&]/.test(password)) {
        errors.password = "Password must contain at least one special character (@, $, !, %, *, ?, &).";
      }
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((errMsg) => {
        toast.error(errMsg, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
      return;
    }
    
    try {
      const response = await axios.post('https://hub-cde3.onrender.com/api/user/register', { username, email, password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      
      toast.success('Registration Successful!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Optionally, update auth token state if needed
      if (setAuthToken) setAuthToken(token);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration Failed! Try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="register-card">
        <h2 className="register-heading">Register</h2>
        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="reg-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="reg-input"
          />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="reg-input"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button type="submit" className="reg-submit-btn">Register</button>
        </form>
        <p className="login-prompt">
          Already have an account?{' '}
          <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Registerpage;
