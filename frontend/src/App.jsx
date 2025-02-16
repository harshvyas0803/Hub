import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import BlogDetail from './pages/BlogDetail';
import UpdateBlog from './pages/UpdateBlog';
import 'react-toastify/dist/ReactToastify.css';

// Inline PublicRoute component: if the user is authenticated, redirect to Home.
const PublicRoute = ({ children, authToken }) => {
  return authToken ? <Navigate to="/" replace /> : children;
};

const App = () => {
  // Use state to track the authentication token.
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  // Optionally, listen for storage changes (if multiple tabs are used)
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div>
      <div className="content">
        <Routes>
          {authToken ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/createblog" element={<CreateBlog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/updateblog/:id" element={<UpdateBlog />} />
              {/* Redirect any unknown route to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={
                  <PublicRoute authToken={authToken}>
                    <Loginpage setAuthToken={setAuthToken} />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute authToken={authToken}>
                    <Registerpage setAuthToken={setAuthToken} />
                  </PublicRoute>
                }
              />
              {/* Redirect any unknown route to Login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;
