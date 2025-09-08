import express, { json } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(json());

// GET route that returns server status and port information
app.get('/', (req, res) => {
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
