const express = require('express');
const router = express.Router();
const { store, generateId } = require('../data/store');

// GET /users - List all users
router.get('/', (req, res) => {
  res.json(store.users);
});

// GET /users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const user = store.users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST /users - Create new user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: generateId(store.users),
    name,
    email
  };

  store.users.push(newUser);
  res.status(201).json(newUser);
});
module.exports = router;
