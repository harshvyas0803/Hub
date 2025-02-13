import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import './CreateBlog.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
 
import { useBlog } from '../context/BlogContext';  

const CreateBlog = () => {
  const { user } = useBlog(); // Get the logged-in user from context
  const [title, setTitle] = useState(localStorage.getItem('createBlogTitle') || '');
  const [category, setCategory] = useState(localStorage.getItem('createBlogCategory') || '');
  const [content, setContent] = useState(localStorage.getItem('createBlogContent') || '');
  const [tags, setTags] = useState(localStorage.getItem('createBlogTags') || '');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Save each field's value to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('createBlogTitle', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('createBlogCategory', category);
  }, [category]);

  useEffect(() => {
    localStorage.setItem('createBlogContent', content);
  }, [content]);

  useEffect(() => {
    localStorage.setItem('createBlogTags', tags);
  }, [tags]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:2005/api/categories');
        console.log('Fetched categories:', response.data);
        const sortedCategories = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedCategories);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error('Please select a category.');
      return;
    }

    const postData = { title, category, content, tags };
    console.log('Sending post data:', postData);

    try {
      const token = localStorage.getItem('authToken');
      console.log('Token from localStorage:', token);
      const response = await axios.post(
        'http://localhost:2005/api/posts/create',
        postData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        }
      );
      console.log('Response from backend:', response.data);
      toast.success('Blog created successfully!');

      // Reset form and clear localStorage
      setTitle('');
      setCategory('');
      setContent('');
      setTags('');
      localStorage.removeItem('createBlogTitle');
      localStorage.removeItem('createBlogCategory');
      localStorage.removeItem('createBlogContent');
      localStorage.removeItem('createBlogTags');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.message || 'Error creating post');
    }
  };

  return (
    <div className="create-blog-page">
      <Navbar />
    
      {user ? (
        <div className="create-blog-container">
          <h1>Create a Blog Post</h1>
          <form onSubmit={handleSubmit} className="create-blog-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="create-blog-title"
              required
            />

            {/* Category Dropdown */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="create-blog-category"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your blog post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="create-blog-content"
              required
            />

            <input
              type="text"
              placeholder="Tags (optional, comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="create-blog-tags"
            />

            <button type="submit" className="create-blog-submit">
              Publish
            </button>
          </form>
        </div>
      ) : (
        <div className="login-cardCB">
          <h2>Access Denied</h2>
          <p>
            Please{' '}
            <span className="clickable" onClick={() => navigate('/login')}>
              login
            </span>{' '}
            or{' '}
            <span className="clickable" onClick={() => navigate('/register')}>
              register
            </span>{' '}
            to create a blog post.
          </p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateBlog;
