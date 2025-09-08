import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/users/:id
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/users
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      // Basic validation
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
        return;
      }

      const userData: CreateUserDto = {
        name: name || 'Test User',
        email: email || `test${Date.now()}@example.com`,
        password: password || 'password123',
        role: role || 'user'
      };

      const user = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message === 'Email already exists' ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/users/:id
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      const userData: UpdateUserDto = req.body;
      const user = await this.userService.updateUser(id, userData);
      
      res.json({
        success: true,
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === 'User not found') statusCode = 404;
        if (error.message === 'Email already exists') statusCode = 409;
      }

      res.status(statusCode).json({
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
        return;
      }

      await this.userService.deleteUser(id);
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message === 'User not found') statusCode = 404;
        if (error.message.includes('Cannot delete')) statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
