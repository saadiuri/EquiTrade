import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './config/database';
import apiRoutes from './routes';

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

// Root route - server status
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

// API routes
app.use('/api', apiRoutes);

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
