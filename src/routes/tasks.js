const express = require('express');
const router = express.Router();
const { store, generateId } = require('../data/store');

// GET /tasks - List all tasks
router.get('/', (req, res) => {
  res.json(store.tasks);
});

// GET /tasks/:id - Get task by ID
router.get('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /tasks - Create new task
router.post('/', (req, res) => {
  const { title, userId } = req.body;
  if (!title || !userId) {
    return res.status(400).json({ error: 'Title and userId are required' });
  }

  const user = store.users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newTask = {
    id: generateId(store.tasks),
    title,
    userId: parseInt(userId),
    completed: false,
    createdAt: new Date().toISOString()
  };

  store.tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /tasks/:id - Update task
router.patch('/:id', (req, res) => {
  const task = store.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed } = req.body;
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});
