import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import BlogDetail from './pages/BlogDetail';
import UpdateBlog from './pages/UpdateBlog';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      {/* The content container below will render your pages based on the route */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/updateblog/:id" element={<UpdateBlog />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
