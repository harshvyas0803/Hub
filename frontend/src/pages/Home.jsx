// Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import FetchedCards from "../components/fetchedcards/FetchedCards"; 
import { Link } from 'react-router-dom';
import "./Home.css";
import Animload from "./Animload"

const Home = () => {
   const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
        const response = await axios.get('https://hub-cde3.onrender.com/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchPosts();
  }, []);


useEffect(() => {

  setTimeout(() => {
    setIsLoading(false);
  }, 5000);
   
}, [])



  // Filter posts based on selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category?.name === selectedCategory)
    : posts;


    if (!isAuthenticated) {
      return (
        <div className="access-denied-container">
          <div className="access-denied-card">
            <div className="denied-content">
              <h2 className="denied-title">Access Restricted</h2>
              <p className="denied-message">Please authenticate to view this content</p>
              
              <div className="auth-buttons">
                <Link to="/login" className="auth-btn login-btn">
                  <span>Sign In</span>
                  <div className="icon">
                    <svg>...</svg>
                  </div>
                </Link>
                
                <Link to="/register" className="auth-btn register-btn">
                  <span>Create Account</span>
                  <div className="icon">
                    <svg>...</svg>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="denied-decoration">
              <div className="glow"></div>
              <div className="shards"></div>
            </div>
          </div>
        </div>
      );
    }

  return (
    
    <>
    {isLoading ? <Animload /> : 
 
    
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

    }
    </>
  );
};

export default Home;
