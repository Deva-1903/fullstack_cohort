const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token error' });
  }

  const token = parts[1];

  try {
    const verified = jwt.verify(token, '123abc');
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Create a post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { 
      title,
      content 
    } = req.body;

    const post = new Post({ title, content, author: req.userId });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Get all posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Update a post
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Delete a post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.userId });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

module.exports = router;