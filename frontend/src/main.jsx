import React, {useState,useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BlogProvider } from "./context/BlogContext";
import 'react-toastify/dist/ReactToastify.css';
import favicon from "../assets/favicon.ico";
import Animload from "./pages/Animload"




const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Create a link element for the favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = favicon;
    document.head.appendChild(link);

    // Clean up on unmount
    return () => {
      document.head.removeChild(link);
    };
  }, []);

useEffect(() => {

  setTimeout(() => {
    setIsLoading(false);
  }, 5000);
   
}, [])




  return (
    <BlogProvider>
      <BrowserRouter>
      <>
      {isLoading ? <Animload /> : <App />}
    </>
      </BrowserRouter>
    </BlogProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
