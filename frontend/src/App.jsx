import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateBlog from './pages/CreateBlog'
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage'

 
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div>
    
      {/* Content starts after navbar */}
      <div className="content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createblog' element={<CreateBlog />} />
          {/* <Route path='/about' element={<About />} /> */}

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

Home Page (showing recent posts)
Blog Post Page (individual post details)
Login/Register Page (for users to log in and create accounts)
Create Post Page (for authenticated users to write blog posts)
Profile Page (user details and posts they've written)
Edit Post Page (to edit existing posts)


*/