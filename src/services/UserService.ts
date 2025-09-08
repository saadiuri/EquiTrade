import { UserRepository } from '../db/repositories/UserRepository';
import { User } from '../db/entities/User';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(this.toUserDto);
  }

  async getUserById(id: number): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.toUserDto(user) : null;
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    // Business logic: validate email uniqueness
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Business logic: set default role
    const userToCreate = {
      ...userData,
      role: userData.role || 'user'
    };

    const user = await this.userRepository.create(userToCreate);
    return this.toUserDto(user);
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<UserDto | null> {
    // Business logic: check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Business logic: validate email uniqueness if email is being updated
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(userData.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    return updatedUser ? this.toUserDto(updatedUser) : null;
  }

  async deleteUser(id: number): Promise<boolean> {
    // Business logic: check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Business logic: prevent deletion of admin users (example)
    if (existingUser.role === 'admin') {
      const adminCount = await this.userRepository.count();
      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }

    return await this.userRepository.delete(id);
  }

  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
