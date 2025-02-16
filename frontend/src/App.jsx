import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import BlogDetail from './pages/BlogDetail';
import UpdateBlog from './pages/UpdateBlog';
import 'react-toastify/dist/ReactToastify.css';

// Inline PublicRoute component: if the user is authenticated, redirect to Home.
const PublicRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? <Navigate to="/" replace /> : children;
};

const App = () => {
  const authToken = localStorage.getItem('authToken');

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
              {/* If logged in, any unknown route redirects to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Loginpage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Registerpage />
                  </PublicRoute>
                }
              />
              {/* If not logged in, any unknown route redirects to Login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;
