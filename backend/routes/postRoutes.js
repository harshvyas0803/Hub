import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Category from '../models/Category.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import User from '../models/User.js';


const router = express.Router();

// Create Post Route (unchanged)
router.post('/create', authMiddleware, async (req, res) => {
  const { title, category, content, tags } = req.body;
  const userId = req.userId;
  try {
    if (!title || !category || !content) {
      return res.status(400).json({ message: 'Title, category, and content are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      return res.status(400).json({ message: 'Category not found' });
    }
    const newPost = new Post({
      title,
      category: categoryData._id,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: userId,
    });
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Posts Route (with population)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


 // Like a Post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.userId;
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    }
    await post.save();
    res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Dislike a Post
router.post('/:postId/dislike', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.userId;

    // Toggle dislike: if already disliked, remove; else add and remove any like.
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(id => id.toString() !== userId);
    }
    await post.save();
    res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a comment to a Post
router.post('/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.userId); // Fetch user details
    if (!user) return res.status(404).json({ message: 'User not found' });

    const comment = { user: req.userId, username: user.username, text }; // Include username
    post.comments.push(comment);
    await post.save();

    res.json(comment); // Return the comment with the username
  } catch (error) {
    console.error("Error adding comment:", error); // Log error in console
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Delete a Post Route

// Delete a Post Route
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    
    // Delete the post using deleteOne()
    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error("Error in DELETE /api/posts/:postId", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// In your posts route file (e.g., routes/posts.js)
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username')
      .populate('category', 'name');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});





 // routes/posts.js
router.delete('/:postId', authMiddleware, async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the logged-in user is the author of the post
    // Ensure that post.author is stored as an ObjectId or a string
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
    
    // Delete the post
    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    // Log error details to help with debugging
    console.error("Error in DELETE /api/posts/:postId", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
