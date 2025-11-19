import { Router } from 'express';
import { AnuncioController } from '../controllers/AnuncioController';

const router = Router();
const anuncioController = new AnuncioController();

router.get('/vendedor/:vendedorId', anuncioController.getAnunciosByVendedor.bind(anuncioController));

router.get('/:id', anuncioController.getAnuncioById.bind(anuncioController));

router.get('/', anuncioController.getAllAnuncios.bind(anuncioController));

router.post('/', anuncioController.createAnuncio.bind(anuncioController));

router.put('/:id', anuncioController.updateAnuncio.bind(anuncioController));

router.put('/:id/inactive', anuncioController.markAnuncioAsInactive.bind(anuncioController));

router.put('/:id/active', anuncioController.markAnuncioAsActive.bind(anuncioController));

router.delete('/:id', anuncioController.deleteAnuncio.bind(anuncioController));

export default router;

