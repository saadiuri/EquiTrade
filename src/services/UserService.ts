import { UserRepository } from '../db/repositories/UserRepository';
import { User } from '../db/entities/User';
import { Comprador } from '../db/entities/Comprador';
import { Vendedor } from '../db/entities/Vendedor';
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserDto, 
  CompradorDto, 
  VendedorDto,
  CreateCompradorDto,
  CreateVendedorDto,
  UpdateCompradorDto,
  UpdateVendedorDto,
  USER_TYPE
} from '../dto/user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(user => this.toUserDto(user));
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.toUserDto(user) : null;
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {

    const existingUser = await this.userRepository.findByEmail(userData.data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create user based on type
    if (userData.type === USER_TYPE.COMPRADOR) {
      const comprador = await this.userRepository.createComprador(userData.data);
      return this.toUserDto(comprador);
    } else {
      // Default nota to 0.0 if not provided for Vendedor
      const vendedorData = {
        ...userData.data,
        nota: userData.data.nota ?? 0.0
      };
      const vendedor = await this.userRepository.createVendedor(vendedorData);
      return this.toUserDto(vendedor);
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserDto | null> {
    // Business logic: check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Business logic: validate email uniqueness if email is being updated
    if (userData.data.email && userData.data.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(userData.data.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Update user based on type and existing type
    let updatedUser: User | null = null;

    if (userData.type === USER_TYPE.COMPRADOR) {
      // Ensure we're updating the right type
      const comprador = await this.userRepository.findCompradorById(id);
      if (!comprador) {
        throw new Error('User is not a Comprador');
      }
      updatedUser = await this.userRepository.updateComprador(id, userData.data as UpdateCompradorDto);
    } else {
      // Vendedor
      const vendedor = await this.userRepository.findVendedorById(id);
      if (!vendedor) {
        throw new Error('User is not a Vendedor');
      }
      updatedUser = await this.userRepository.updateVendedor(id, userData.data as UpdateVendedorDto);
    }

    return updatedUser ? this.toUserDto(updatedUser) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    // Business logic: check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.userRepository.delete(id);
  }

  // Type-specific methods for better API
  async getAllCompradores(): Promise<CompradorDto[]> {
    const compradores = await this.userRepository.getAllCompradores();
    return compradores.map(comprador => this.toCompradorDto(comprador));
  }

  async getAllVendedores(): Promise<VendedorDto[]> {
    const vendedores = await this.userRepository.getAllVendedores();
    return vendedores.map(vendedor => this.toVendedorDto(vendedor));
  }

  async createComprador(userData: CreateCompradorDto): Promise<CompradorDto> {
    //validate email uniqueness
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const comprador = await this.userRepository.createComprador(userData);
    return this.toCompradorDto(comprador);
  }

  async createVendedor(userData: CreateVendedorDto): Promise<VendedorDto> {
    //validate email uniqueness
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Default nota to 0.0 if not provided
    const vendedorData = {
      ...userData,
      nota: userData.nota ?? 0.0
    };

    const vendedor = await this.userRepository.createVendedor(vendedorData);
    return this.toVendedorDto(vendedor);
  }

  // Private mapping methods
  private toUserDto(user: User): UserDto {
    if (user instanceof Comprador) {
      return this.toCompradorDto(user);
    } else if (user instanceof Vendedor) {
      return this.toVendedorDto(user);
    } else {
      // Fallback - check constructor name as TypeORM might not preserve instanceof
      const userType = user.constructor.name;
      if (userType === USER_TYPE.COMPRADOR) {
        return this.toCompradorDto(user as Comprador);
      } else {
        return this.toVendedorDto(user as Vendedor);
      }
    }
  }

  private toCompradorDto(comprador: Comprador): CompradorDto {
    return {
      id: comprador.id,
      nome: comprador.nome,
      email: comprador.email,
      celular: comprador.celular,
      endereco: comprador.endereco,
      type: USER_TYPE.COMPRADOR,
      createdAt: comprador.createdAt,
      updatedAt: comprador.updatedAt
    };
  }

  private toVendedorDto(vendedor: Vendedor): VendedorDto {
    return {
      id: vendedor.id,
      nome: vendedor.nome,
      email: vendedor.email,
      celular: vendedor.celular,
      endereco: vendedor.endereco,
      type: USER_TYPE.VENDEDOR,
      nota: vendedor.nota,
      numero_avaliacoes: vendedor.numero_avaliacoes,
      createdAt: vendedor.createdAt,
      updatedAt: vendedor.updatedAt
    };
  }

  async rateVendedor(vendedorId: string, rating: number): Promise<VendedorDto> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const user = await this.userRepository.findById(vendedorId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!(user instanceof Vendedor)) {
      throw new Error('User is not a seller');
    }

    const currentTotal = user.nota * user.numero_avaliacoes;
    const newNumAvaliacoes = user.numero_avaliacoes + 1;
    const newNota = (currentTotal + rating) / newNumAvaliacoes;

    const updatedVendedor = await this.userRepository.updateVendedor(vendedorId, {
      nota: newNota,
      numero_avaliacoes: newNumAvaliacoes
    });

    if (!updatedVendedor) {
      throw new Error('Failed to update seller rating');
    }

    return this.toVendedorDto(updatedVendedor);
  }
}
