import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Loginpage.css';
import { Link } from 'react-router-dom';

const Loginpage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:2005/api/user/login', { email, password });
      const token = response.data.token;
      const username = response.data.username
      localStorage.setItem('authToken', token);
      localStorage.setItem('username',username)
      
      toast.success('Login Successful!', {
        position: 'top-right',  
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login Failed! Please check credentials.', {
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
          <input
            type="password"
            placeholder="Password here"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-fieldl"
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="register-txt">
          Not a member? 
          <Link to="/register" className="register-btn">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Loginpage;
