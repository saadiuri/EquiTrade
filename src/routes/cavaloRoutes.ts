import { Router } from 'express';
import { CavaloController } from '../controllers/CavaloController';

const router = Router();
const cavaloController = new CavaloController();

// GET /api/cavalos/stats - Get cavalo statistics (must be before /:id route)
router.get('/stats', cavaloController.getCavaloStats.bind(cavaloController));

// GET /api/cavalos/dono/:donoId - Get cavalos by owner
router.get('/dono/:donoId', cavaloController.getCavalosByDono.bind(cavaloController));

// GET /api/cavalos/:id - Get cavalo by ID
router.get('/:id', cavaloController.getCavaloById.bind(cavaloController));

// GET /api/cavalos - Get all cavalos with optional filters
// Query parameters: disponivel, raca, precoMin, precoMax, idadeMin, idadeMax, donoId
router.get('/', cavaloController.getAllCavalos.bind(cavaloController));

// POST /api/cavalos - Create new cavalo
router.post('/', cavaloController.createCavalo.bind(cavaloController));

// PUT /api/cavalos/:id - Update cavalo
router.put('/:id', cavaloController.updateCavalo.bind(cavaloController));

// PUT /api/cavalos/:id/unavailable - Mark cavalo as unavailable (sold)
router.put('/:id/unavailable', cavaloController.markCavaloAsUnavailable.bind(cavaloController));

// PUT /api/cavalos/:id/available - Mark cavalo as available
router.put('/:id/available', cavaloController.markCavaloAsAvailable.bind(cavaloController));

// DELETE /api/cavalos/:id - Delete cavalo
router.delete('/:id', cavaloController.deleteCavalo.bind(cavaloController));

export default router;
