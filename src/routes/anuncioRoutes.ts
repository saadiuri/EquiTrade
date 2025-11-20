import { Router } from 'express';
import { AnuncioController } from '../controllers/AnuncioController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const anuncioController = new AnuncioController();

// Public routes - Browse listings
router.get('/vendedor/:vendedorId', anuncioController.getAnunciosByVendedor.bind(anuncioController));
router.get('/:id', anuncioController.getAnuncioById.bind(anuncioController));
router.get('/', anuncioController.getAllAnuncios.bind(anuncioController));

// Protected routes - Require authentication
router.post('/', authenticate, anuncioController.createAnuncio.bind(anuncioController));
router.put('/:id', authenticate, anuncioController.updateAnuncio.bind(anuncioController));
router.put('/:id/inactive', authenticate, anuncioController.markAnuncioAsInactive.bind(anuncioController));
router.put('/:id/active', authenticate, anuncioController.markAnuncioAsActive.bind(anuncioController));
router.delete('/:id', authenticate, anuncioController.deleteAnuncio.bind(anuncioController));

export default router;

