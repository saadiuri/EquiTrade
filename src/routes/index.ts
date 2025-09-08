import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Mount route modules
router.use('/users', userRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
