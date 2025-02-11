// Sidebar.js
import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import axios from 'axios';

const Sidebar = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:2005/api/categories');
        // Sort categories alphabetically by name
        const sortedCategories = response.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="sidebar_">
      <h3>Categories</h3>
      <div className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <p
              key={category._id}
              className="category-button"
              onClick={() => onCategorySelect(category.name)}
            >
              {category.name}
            </p>
          ))
        ) : (
          <p className="npa_S">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
