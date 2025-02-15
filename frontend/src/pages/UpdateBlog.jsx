import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import "./UpdateBlog.css"; // Create or update this CSS file for styling

const UpdateBlog = () => {
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  const [categories, setCategories] = useState([]);

  // Fetch blog details to pre-populate the form
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:2005/api/posts/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        });
        const blog = response.data;
        setBlogData({
          title: blog.title,
          content: blog.content,
          category: blog.category?._id || "",
          tags: blog.tags ? blog.tags.join(", ") : ""
        });
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Error fetching blog details!");
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch all categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:2005/api/categories");
        // Sort categories alphabetically
        const sortedCategories = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  // Handle update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(`https://hub-cde3.onrender.com/api/posts/${id}`, blogData, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      toast.success("Blog updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Error updating blog. Please try again.");
    }
  };

  return (
    <div className="update-blog-page">
      <Navbar />
      <Sidebar />
      <div className="update-blog-container">
        <h1>Update Blog Post</h1>
        <form onSubmit={handleUpdate} className="update-blog-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={blogData.title}
            onChange={handleChange}
            required
            className="update-input"
          />
          <select
            name="category"
            value={blogData.category}
            onChange={handleChange}
            required
            className="update-input"
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
            name="content"
            placeholder="Content"
            value={blogData.content}
            onChange={handleChange}
            required
            className="update-textarea"
          ></textarea>
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={blogData.tags}
            onChange={handleChange}
            className="update-input"
          />
          <button type="submit" className="update-submit-btn">
            Update Blog
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateBlog;
