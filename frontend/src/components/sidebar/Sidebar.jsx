import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Animload from '../../pages/Animload';

const Sidebar = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://hub-cde3.onrender.com/api/categories');
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

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const handleCategoryClick = (categoryName) => {
    onCategorySelect(categoryName);
    setIsOpen(false);
  };

  return (
    <div className="sidebar-container">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "Hide  " : " Categories"}
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="toggle-icon"
        />
      </button>
      {isOpen && (
        <div className="sidebar_">
          <div className="categories-list">
            <p 
              className={`category-button ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => handleCategoryClick("")}
            >
              <span>All</span>
            </p>
            {categories.length > 0 ? (
              categories.map((category) => (
                <p
                  key={category._id}
                  className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <span>{category.name}</span>
                </p>
              ))
            ) : (
              <p className="npa_S">
                No categories available
                <Animload/>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;