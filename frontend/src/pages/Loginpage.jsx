// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Loginpage.css';
// import { Link } from 'react-router-dom';

// const Loginpage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//  // In the Login page
//  const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post('http://localhost:2005/api/user/login', { email, password });
//     const { token, username, email, createdAt } = response.data;

//     // Store all relevant information in localStorage
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('username', username);
//     localStorage.setItem('email', email);
//     localStorage.setItem('createdAt', createdAt);
    
//     toast.success('Login Successful!', {
//       position: 'top-right',
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });

//     setTimeout(() => {
//       navigate('/');
//     }, 2000);
//   } catch (error) {
//     console.error('Login failed', error);
//     toast.error('Login Failed! Please check credentials.', {
//       position: 'top-right',
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   }
// };


//   return (
//     <div className="login-container">
//       <ToastContainer />
//       <div className="login-card">
//         <h2 className="login-heading">Login</h2>
//         <form className="form" onSubmit={handleLogin}>
//           <input
//             type="email"
//             placeholder="Email here"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="input-fieldl"
//           />
//           <input
//             type="password"
//             placeholder="Password here"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="input-fieldl"
//           />
//           <button type="submit" className="submit-btn">Login</button>
//         </form>
//         <p className="register-txt">
//           Not a member? 
//           <Link to="/register" className="register-btn">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Loginpage;

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

  // Handle login on form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login initiated');  // Log 1
  
    try {
      const response = await axios.post('http://localhost:2005/api/user/login', { email, password });
      console.log('Response:', response.data);  // Debug API response
    
      // Destructure safely
      const { token, username, email: userEmail, createdAt } = response.data;
      console.log('Extracted:', { token, username, userEmail, createdAt });
    
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);  // Changed here
      localStorage.setItem('createdAt', createdAt);
      
      toast.success('Login Successful!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login Failed!');
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
