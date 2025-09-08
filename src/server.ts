import express, { Application, Request, Response } from 'express';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string) || 3000;

// Middleware to parse JSON
app.use(express.json());

// GET route that returns server status and port information
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'EquiTrade server is running!',
    port: PORT,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 EquiTrade server is running on port ${PORT}`);
  console.log(`📍 Access the server at: http://localhost:${PORT}`);
});

export default app;
