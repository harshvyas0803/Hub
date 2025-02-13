import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog'
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage'
import BlogDetail from './pages/BlogDetail';
 

 
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
    
      {/* Content starts after navbar */}
      <div className="content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createblog' element={<CreateBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />


           {/* login route */}
          <Route path='/login' element={<Loginpage />} />
          <Route path='/register' element={<Registerpage/>} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
/*

Blog Post Page (individual post details)

*/