import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './config/database';
import { User } from './db/entities/User';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string) || 3000;

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Middleware to parse JSON
app.use(express.json());

// GET route that returns server status and port information
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'EquiTrade server is running!',
    port: PORT,
    status: 'healthy',
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test database route
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      name: req.body.name || 'Test User',
      email: req.body.email || `test${Date.now()}@example.com`,
      password: req.body.password || 'password123',
      role: req.body.role || 'user'
    });
    
    const savedUser = await userRepository.save(user);
    res.json({
      success: true,
      message: 'User created (check console for subscriber logs)',
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await userRepository.update(user.id, req.body);
    const updatedUser = await userRepository.findOne({ where: { id: user.id } });
    
    res.json({
      success: true,
      message: 'User updated',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start the server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`EquiTrade server is running on port ${PORT}`);
    console.log(`Access the server at: http://localhost:${PORT}`);
    console.log(` Database: ${AppDataSource.isInitialized ? 'Connected' : 'Disconnected'}`);
  });
};

// Initialize everything
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
