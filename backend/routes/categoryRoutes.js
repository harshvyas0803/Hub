import express from 'express'
import Category from '../models/Category.js'

const router = express.Router()


router.get('/', async (req, res) => {
    try {
      const categories = await Category.find(); // Fetch categories from DB
  
      res.json(categories); // Send categories to frontend
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });
  
  export default router;