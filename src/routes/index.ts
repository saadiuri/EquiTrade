import { Router } from 'express';
import userRoutes from './userRoutes';
import cavaloRoutes from './cavaloRoutes';
import mensagemRoutes from './mensagemRoutes';

const router = Router();

// Mount route modules
router.use('/users', userRoutes);
router.use('/cavalos', cavaloRoutes);
router.use('/mensagens', mensagemRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
