// BlogDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import FetchedCards from "../components/fetchedcards/FetchedCards";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:2005/api/posts/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : "" }
        });
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="home-page">
        <Navbar />
        <Sidebar onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
        <div className="content-wrapper">
          <h2 className="home-heading">Loading blog...</h2>
        </div>
      </div>
    );
  }

  // Pass the single blog as an array to FetchedCards.
  const singleBlogArray = [blog];

  return (
    <div className="home-page">
      <Navbar />
      <Sidebar onCategorySelect={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="content-wrapper">
        <h2 className="home-heading">Blog Detail</h2>
        <FetchedCards posts={singleBlogArray} defaultExpandSingle />
        
    
      </div>
    </div>
  );
};

export default BlogDetail;
