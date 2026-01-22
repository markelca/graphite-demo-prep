const express = require('express');
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const { authMiddleware, setToken } = require('./middleware/auth');
const { store } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/health', healthRoutes);
app.use('/users', userRoutes);
app.use('/tasks', authMiddleware, taskRoutes);

// Login endpoint
app.post('/login', (req, res) => {
  const { email } = req.body;
  const user = store.users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate simple token (for demo only)
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  setToken(token, user);

  res.json({ token, user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
