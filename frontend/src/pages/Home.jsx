import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import FetchedCards from "../components/fetchedcards/FetchedCards"; // Import new component
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:2005/api/posts", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          params: { category: selectedCategory },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  return (
    <div className="home-page">
    <Navbar />
    <Sidebar onCategorySelect={setSelectedCategory} />
    <div className="content-wrapper">
      <h2 className="home-heading">Recent Posts</h2>
      <FetchedCards posts={posts} />
    </div>
  </div>
  );
};

export default Home;
