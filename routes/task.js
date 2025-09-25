const express = require('express');
const Task = require('../models/task');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const tasks = await Task.find().populate('user', 'name email');
      return res.json(tasks);
    }
    const tasks = await Task.find({ user: req.user.id }).populate(
      'user',
      'name email'
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });
    const task = await Task.create({ title, description, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });

    if (req.user.role !== 'admin' && String(task.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatable = ['title', 'description', 'status'];
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) task[k] = req.body[k];
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && String(task.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await task.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && String(task.user) !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
