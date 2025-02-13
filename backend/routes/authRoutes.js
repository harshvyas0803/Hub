// backend/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'kjdfnjdnfjdjkfndkjnfdnkfnfkjfjsdfijrioerry'

// Register Route

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  // Extracts username, email, and password from the request body (req.body).The frontend must send these details in JSON format.

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    //Searches the database (User.findOne({ email })) for an existing user with the same email.
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password,Uses bcrypt.js to hash the password before storing it.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user,Creates a new user object with:username: From request.email: From request.   password: Hashed password (not plain text).
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
  
 // Login Route in authRoutes.js
 // Login Route in authRoutes.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Convert user document to plain object to ensure timestamps are accessible
    const userObj = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      email: user.email,
      createdAt: userObj.createdAt, // Now explicitly include createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;



/*

           Feature	Description
Register (/register)	- Checks if user exists.
- Hashes password.
- Saves user in DB.
- Returns JWT token.
Login (/login)	- Checks if user exists.
- Compares password with hashed password.
- Returns JWT token.
JWT Usage	- Used for authentication.
- Token expires in 1 hour.
Error Handling	- Sends proper HTTP status codes.





*/