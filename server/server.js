const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const essayRoutes = require('./routes/essay');
const toolRoutes = require('./routes/tools');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let dbType = 'disconnected';
let dbStatus = 'disconnected';

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('your_') && !uri.includes('change_this')) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      dbType = uri.startsWith('mongodb+srv') ? 'Atlas' : 'configured URI';
      dbStatus = 'connected';
      console.log(`MongoDB connected: ${dbType}`);
      return;
    } catch (err) {
      console.warn(`Configured MONGODB_URI failed (${err.message}). Falling back to in-memory MongoDB.`);
    }
  } else {
    console.warn('MONGODB_URI not set or is a placeholder. Falling back to in-memory MongoDB.');
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mem = await MongoMemoryServer.create();
  const memUri = mem.getUri();
  await mongoose.connect(memUri);
  dbType = 'in-memory';
  dbStatus = 'connected';
  console.log(`MongoDB connected (in-memory): ${memUri}`);
}

mongoose.connection.on('disconnected', () => { dbStatus = 'disconnected'; });
mongoose.connection.on('reconnected', () => { dbStatus = 'connected'; });

connectDB().catch(err => {
  console.error('Failed to start MongoDB:', err);
  process.exit(1);
});

app.use('/api/auth', authRoutes);
app.use('/api/essay', essayRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'AI Essay Writer API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: dbStatus,
    database: dbType,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
