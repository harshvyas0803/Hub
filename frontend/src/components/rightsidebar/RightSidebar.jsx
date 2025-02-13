// RightSidebar.js
import React, { useState, useEffect } from 'react';
import './RightSidebar.css';
import axios from 'axios';


const RightSidebar = () => {
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // New state for modal

  // Fetch user data from localStorage once the component mounts
  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const createdAt = localStorage.getItem('createdAt');
    const authToken = localStorage.getItem('authToken');

    if (username && email && createdAt && authToken) {
      setUser({ username, email, createdAt, authToken });
    } else {
      console.log('No user logged in');
    }
  }, []);

  // Fetch user blogs once the user data is available
  useEffect(() => {
    if (user && user.authToken) {
      const fetchUserBlogs = async () => {
        try {
          const response = await axios.get('http://localhost:2005/api/posts/', {
            headers: { Authorization: `Bearer ${user.authToken}` },
          });
          // Filter posts to only include those where the author matches the logged-in user
          const userPosts = response.data.filter(
            post => post.author && post.author.username === user.username
          );
          setUserBlogs(userPosts);
        } catch (error) {
          console.error('Error fetching user blogs:', error);
        }
      };
      fetchUserBlogs();
    }
  }, [user]);

  // Handler when a blog title is clicked
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
  };

  // Handler to close the modal
  const closeModal = () => {
    setSelectedBlog(null);
  };

  if (!user) {
    return (
      <div className="rightsidebar_">
        <h3>Loading user information...</h3>
      </div>
    );
  }

  return (
    <div className="rightsidebar_">
      <h3>Good to see you</h3>
      <div className="user-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Blogs:</strong> {userBlogs.length}</p>
      </div>
      <h4>Your Blogs</h4>
      <div className="user-blogs">
        {userBlogs.length > 0 ? (
          userBlogs.map((blog) => (
            <p
              key={blog._id}
              className="user-blog-title"
              onClick={() => handleBlogClick(blog)}
            >
              {blog.title}
            </p>
          ))
        ) : (
          <p>No blogs yet</p>
        )}
      </div>

      {/* Modal to display the selected blog's details */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBlog.title}</h2>
            {/* You can add more details as needed */}
            <p>{selectedBlog.content}</p>
            <p>
              <strong>Category:</strong> {selectedBlog.category?.name}
            </p>
            <p>
              <strong>Published on:</strong> {new Date(selectedBlog.createdAt).toLocaleString()}
            </p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
