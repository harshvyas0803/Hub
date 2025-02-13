// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Post from "./models/Post.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myBlogDB";

// Sample categories
const categoriesData = [
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

// Sample users
const sampleUsers = [
  { username: "user1", email: "user1@gmail.com", password: "user1" },
  { username: "user2", email: "user2@gmail.com", password: "user2" },
  { username: "user3", email: "user3@gmail.com", password: "user3" },
  { username: "user4", email: "user4@gmail.com", password: "user4" },
  { username: "user5", email: "user5@gmail.com", password: "user5" },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected.");

    // Delete existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("Existing data cleared.");

    // Insert categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${createdCategories.length} categories.`);

    // Hash passwords and insert sample users
    const saltRounds = 12;
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`Inserted ${createdUsers.length} users.`);

    // For each user, create 5 sample posts in different categories
    // (For simplicity, we use the first 5 categories from the created categories)
    for (const user of createdUsers) {
      for (let i = 0; i < 20; i++) {
        // Cycle through the first 5 categories (or random if you prefer)
        const category = createdCategories[i % createdCategories.length];
        const newPost = new Post({
          title: `Sample Post ${i + 1} by ${user.username}`,
          content: `This is a sample blog post in the "${category.name}" category authored by ${user.username}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          category: category._id,
          author: user._id,
          tags: ["sample", "blog", category.name]
        });
        await newPost.save();
        console.log(`Created post "${newPost.title}" for user ${user.username} in category ${category.name}`);
      }
    }

    console.log("Database seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
