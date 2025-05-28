import { createContext, useState, useContext } from "react";

 
const BlogContext = createContext();

// Provider component
export const BlogProvider = ({ children }) => {
  // Initialize user state from localStorage, if available.
  const [user, setUser] = useState(() => {
    const storedUsername = localStorage.getItem('username');
    // If a username is stored, return an object with that username, otherwise null.
    return storedUsername ? { name: storedUsername } : null;
  });

  const [blogs, setBlogs] = useState([]); // Store blog posts

  return (
    <BlogContext.Provider value={{ user, setUser, blogs, setBlogs }}>
      {children}
    </BlogContext.Provider>
  );
};

// Custom hook for easy access to context
export const useBlog = () => {
  return useContext(BlogContext);
};
