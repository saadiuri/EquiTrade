import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// GET /api/users/stats - Get user statistics (must be before /:id route)
router.get('/stats', (req, res) => userController.getUserStats(req, res));

// GET /api/users/compradores - Get all compradores
router.get('/compradores', (req, res) => userController.getAllCompradores(req, res));

// GET /api/users/vendedores - Get all vendedores
router.get('/vendedores', (req, res) => userController.getAllVendedores(req, res));

// GET /api/users - List all users (both types)
router.get('/', (req, res) => userController.getAllUsers(req, res));

// GET /api/users/:id - Get user by ID (UUID)
router.get('/:id', (req, res) => userController.getUserById(req, res));

// POST /api/users/compradores - Create new comprador
router.post('/compradores', (req, res) => userController.createComprador(req, res));

// POST /api/users/vendedores - Create new vendedor
router.post('/vendedores', (req, res) => userController.createVendedor(req, res));

// POST /api/users - Create new user (polymorphic)
router.post('/', (req, res) => userController.createUser(req, res));

// PUT /api/users/:id - Update user (polymorphic)
router.put('/:id', (req, res) => userController.updateUser(req, res));

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;
