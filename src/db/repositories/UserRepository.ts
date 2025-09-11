import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { User } from '../entities/User';
import { Comprador } from '../entities/Comprador';
import { Vendedor } from '../entities/Vendedor';

export class UserRepository {
  private compradorRepository: Repository<Comprador>;
  private vendedorRepository: Repository<Vendedor>;

  constructor() {
    this.compradorRepository = AppDataSource.getRepository(Comprador);
    this.vendedorRepository = AppDataSource.getRepository(Vendedor);
  }

  async findAll(): Promise<User[]> {
    const compradores = await this.compradorRepository.find();
    const vendedores = await this.vendedorRepository.find();
    return [...compradores, ...vendedores];
  }

  async findById(id: string): Promise<User | null> {
    // Try to find in Comprador first
    let user: User | null = await this.compradorRepository.findOne({ where: { id } });
    if (user) return user;
    
    // Then try Vendedor
    user = await this.vendedorRepository.findOne({ where: { id } });
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Try to find in Comprador first
    let user: User | null = await this.compradorRepository.findOne({ where: { email } });
    if (user) return user;
    
    // Then try Vendedor
    user = await this.vendedorRepository.findOne({ where: { email } });
    return user || null;
  }

  async createComprador(userData: Partial<Comprador>): Promise<Comprador> {
    const comprador = this.compradorRepository.create(userData);
    return await this.compradorRepository.save(comprador);
  }

  async createVendedor(userData: Partial<Vendedor>): Promise<Vendedor> {
    const vendedor = this.vendedorRepository.create(userData);
    return await this.vendedorRepository.save(vendedor);
  }

  async updateComprador(id: string, userData: Partial<Comprador>): Promise<Comprador | null> {
    await this.compradorRepository.update(id, userData);
    return await this.compradorRepository.findOne({ where: { id } });
  }

  async updateVendedor(id: string, userData: Partial<Vendedor>): Promise<Vendedor | null> {
    await this.vendedorRepository.update(id, userData);
    return await this.vendedorRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    // Try to delete from Comprador first
    let result = await this.compradorRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return true;
    }
    
    // Then try Vendedor
    result = await this.vendedorRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    const compradorCount = await this.compradorRepository.count();
    const vendedorCount = await this.vendedorRepository.count();
    return compradorCount + vendedorCount;
  }

  async countCompradores(): Promise<number> {
    return await this.compradorRepository.count();
  }

  async countVendedores(): Promise<number> {
    return await this.vendedorRepository.count();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const compradorExists = await this.compradorRepository.count({ where: { email } }) > 0;
    if (compradorExists) return true;
    
    const vendedorExists = await this.vendedorRepository.count({ where: { email } }) > 0;
    return vendedorExists;
  }

  // Type-specific finder methods
  async findCompradorById(id: string): Promise<Comprador | null> {
    return await this.compradorRepository.findOne({ where: { id } });
  }

  async findVendedorById(id: string): Promise<Vendedor | null> {
    return await this.vendedorRepository.findOne({ where: { id } });
  }

  async getAllCompradores(): Promise<Comprador[]> {
    return await this.compradorRepository.find();
  }

  async getAllVendedores(): Promise<Vendedor[]> {
    return await this.vendedorRepository.find();
  }
}
