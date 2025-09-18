import { Router } from 'express';
import userRoutes from './userRoutes';
import cavaloRoutes from './cavaloRoutes';

const router = Router();

// Mount route modules
router.use('/users', userRoutes);
router.use('/cavalos', cavaloRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
