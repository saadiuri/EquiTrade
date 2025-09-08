import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// GET /api/users - List all users
router.get('/', (req, res) => userController.getAllUsers(req, res));

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => userController.getUserById(req, res));

// POST /api/users - Create new user
router.post('/', (req, res) => userController.createUser(req, res));

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => userController.updateUser(req, res));

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;
