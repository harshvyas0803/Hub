// Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import FetchedCards from "../components/fetchedcards/FetchedCards"; 
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(' https://hub-cde3.onrender.com/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchPosts();
  }, []);

  // Filter posts based on selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category?.name === selectedCategory)
    : posts;

  return (
    <div className="home-page">
      <Navbar />
      <Sidebar 
        onCategorySelect={setSelectedCategory} 
        selectedCategory={selectedCategory} 
      />
      <div className="content-wrapper">
        <h2 className="home-heading">Recent Posts</h2>
        <FetchedCards posts={filteredPosts} />
      </div>
    </div>
  );
};

export default Home;
