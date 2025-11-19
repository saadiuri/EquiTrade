import { Router } from 'express';
import { CavaloController } from '../controllers/CavaloController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const cavaloController = new CavaloController();

// Public routes - Browse horses
router.get('/dono/:donoId', cavaloController.getCavalosByDono.bind(cavaloController));
router.get('/:id', cavaloController.getCavaloById.bind(cavaloController));
router.get('/', cavaloController.getAllCavalos.bind(cavaloController));

// Protected routes - Require authentication
router.post('/', authenticate, cavaloController.createCavalo.bind(cavaloController));
router.put('/:id', authenticate, cavaloController.updateCavalo.bind(cavaloController));
router.put('/:id/unavailable', authenticate, cavaloController.markCavaloAsUnavailable.bind(cavaloController));
router.put('/:id/available', authenticate, cavaloController.markCavaloAsAvailable.bind(cavaloController));
router.delete('/:id', authenticate, cavaloController.deleteCavalo.bind(cavaloController));

export default router;
