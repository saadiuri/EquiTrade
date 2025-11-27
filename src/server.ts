import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import { swaggerSpec } from './config/swagger';
import apiRoutes from './routes';
import cors from 'cors';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string) || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

app.use(express.json());

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'EquiTrade API Documentation',
}));

// Root route - server status
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'EquiTrade server is running!',
    port: PORT,
    status: 'healthy',
    database: AppDataSource.isInitialized ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    documentation: `http://localhost:${PORT}/docs`
  });
});

// API routes
app.use('/api', apiRoutes);
app.use(express.static("src/resources"));

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 EquiTrade server is running on port ${PORT}`);
    console.log(`📍 Access the server at: http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
    console.log(`🗄️ Database: ${AppDataSource.isInitialized ? 'Connected' : 'Disconnected'}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
