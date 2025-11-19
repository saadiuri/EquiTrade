import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import cavaloRoutes from './cavaloRoutes';
import mensagemRoutes from './mensagemRoutes';
import anuncioRoutes from './anuncioRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cavalos', cavaloRoutes);
router.use('/mensagens', mensagemRoutes);
router.use('/anuncios', anuncioRoutes);

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
