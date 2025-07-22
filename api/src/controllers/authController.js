// ===== FILE: controllers/authController.js =====
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// Register User
export const register = async (req, res) => {
  const { username, email, password, name, preferences } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required.' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        username, 
        email, 
        password: hashedPassword,
        name: name || null,
        preferences: preferences || { unit: 'km', defaultRadius: 5 }
      },
    });

    res.status(201).json({ 
      message: 'User registered successfully.',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Both username and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful',
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        preferences: user.preferences 
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Logout User
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    path: '/',
    sameSite: isProduction ? 'None' : 'Lax',
    secure: isProduction,
  });
  res.json({ message: 'Logged out successfully.' });
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true, 
        preferences: true 
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user });
  } catch (error) {
    console.error('getCurrentUser Error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

// Get user from JWT token
export const getMe = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true, 
        preferences: true 
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('getMe Error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  const { preferences } = req.body;
  const userId = req.user?.id;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences },
      select: { 
        id: true, 
        username: true, 
        email: true, 
        name: true, 
        preferences: true 
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Update preferences Error:', error);
    res.status(500).json({ message: 'Failed to update preferences.' });
  }
};