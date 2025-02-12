import React, { useState, useEffect } from 'react';
import './RightSidebar.css';
import axios from 'axios';

const RightSidebar = () => {
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);

  // Fetch user data from localStorage once the component mounts
  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const createdAt = localStorage.getItem('createdAt');
    const authToken = localStorage.getItem('authToken');

    // Check if the user data exists in localStorage
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
          setUserBlogs(response.data);
        } catch (error) {
          console.error('Error fetching user blogs:', error);
        }
      };
      fetchUserBlogs();
    }
  }, [user]); // Re-run this effect when user state changes

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
            <p key={blog._id} className="user-blog-title">
              {blog.title}
            </p>
          ))
        ) : (
          <p>No blogs yet</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
