const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/taskuser');
const { storage } = require('../config/cloudinary');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already used' });

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: userRole,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/upload-avatar',
  authenticate,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const avatarUrl = req.file?.path;

      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        { new: true }
      );

      res.json({ avatar: user?.avatar });
    } catch (err) {
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'name email avatar role'
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
