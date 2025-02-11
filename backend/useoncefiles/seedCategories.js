import mongoose from "mongoose";
import Category from "../models/Category.js"; // Import your Category model

// Connect to MongoDB
mongoose.connect("mongodb+srv://pinterest:123@hkv3d.0xw2o.mongodb.net/?retryWrites=true&w=majority&appName=Hkv3d")
  .then(() => {
    console.log('MongoDB connected from seed categories');

    const categories = [
      { name: "Technology" },
      { name: "Sports" },
      { name: "Entertainment" },
      { name: "Lifestyle" },
      { name: "Business" },
      { name: "Health & Wellness" },
      { name: "Education" },
      { name: "Travel & Adventure" },
      { name: "Food & Drink" },
      { name: "Science & Nature" },
      { name: "Arts & Culture" },
      { name: "Gaming" },
      { name: "Fashion & Beauty" },
      { name: "Politics & Society" },
      { name: "History & Philosophy" },
      { name: "Finance & Careers" },
      { name: "Home & Family" },
      { name: "Hobbies & Crafts" },
      { name: "Religion & Spirituality" },
      { name: "Automotive & Transport" },
      { name: "Environment & Sustainability" },
      { name: "Relationships & Community" },
      { name: "Media & Journalism" },
      { name: "Innovation & Future Tech" },
      { name: "Other" }
    ];

    // Insert categories into the database
    Category.insertMany(categories)
      .then(() => {
        console.log('Categories added successfully');
        mongoose.disconnect(); // Disconnect after seeding
      })
      .catch((error) => {
        console.error('Error adding categories:', error);
        mongoose.disconnect(); // Disconnect even if there's an error
      });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
