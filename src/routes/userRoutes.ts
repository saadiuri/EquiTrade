import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../db/entities/User';

const router = Router();

// GET /api/users - List all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database query failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/users - Create new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      name: req.body.name || 'Test User',
      email: req.body.email || `test${Date.now()}@example.com`,
      password: req.body.password || 'password123',
      role: req.body.role || 'user'
    });
    
    const savedUser = await userRepository.save(user);
    res.json({
      success: true,
      message: 'User created',
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await userRepository.update(user.id, req.body);
    const updatedUser = await userRepository.findOne({ where: { id: user.id } });
    
    res.json({
      success: true,
      message: 'User updated',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await userRepository.remove(user);
    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
