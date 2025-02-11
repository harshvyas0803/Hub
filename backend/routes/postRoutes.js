import express from 'express';
import mongoose from 'mongoose';
import Post from '../models/Post.js';
import Category from '../models/Category.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Post Route
router.post('/create', authMiddleware, async (req, res) => {
  const { title, category, content, tags } = req.body;
  const userId = req.userId; // Retrieved from authMiddleware

  console.log('Received request to create post');
  console.log('Request Body:', req.body);
  console.log('Authenticated User ID:', userId);

  try {
    // Check if user is authenticated
    if (!userId) {
      console.error('Error: User ID is missing');
      return res.status(401).json({ message: 'Unauthorized: User ID is missing' });
    }

    // Validate required fields
    if (!title || !category || !content) {
      console.error('Error: Missing required fields');
      return res.status(400).json({ message: 'Title, category, and content are required' });
    }

    // Validate category ID format
    if (!mongoose.Types.ObjectId.isValid(category)) {
      console.error('Error: Invalid category ID format');
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Find category by its ObjectId
    const categoryData = await Category.findById(category);
    if (!categoryData) {
      console.error('Error: Category not found for id', category);
      return res.status(400).json({ message: 'Category not found' });
    }

    // Create new post
    const newPost = new Post({
      title,
      category: categoryData._id, // Use the category's ObjectId
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: userId,
    });

    await newPost.save();
    console.log('Post created successfully:', newPost);

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get All Posts Route
router.get('/', async (req, res) => {
  console.log('Fetching all posts...');
  try {
    const posts = await Post.find()
      .populate('author', 'username') // Populates author username
      .populate('category', 'name')   // Populates category name
      .sort({ createdAt: -1 });

    console.log('Posts fetched successfully:', posts.length, 'posts found');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a Post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.userId;

    // Toggle like/dislike behavior
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId); // Remove dislike if exists
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

    // Toggle dislike behavior
    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter(id => id.toString() !== userId); // Remove like if exists
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

    const comment = { user: req.userId, text };
    post.comments.push(comment);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Share a Post (Example: just return post URL)
router.get('/:postId/share', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const postUrl = `${req.protocol}://${req.get('host')}/post/${post._id}`;
    res.json({ message: 'Post link', url: postUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
