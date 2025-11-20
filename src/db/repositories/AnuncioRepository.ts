import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Anuncio } from '../entities/Anuncio';
import { User } from '../entities/User';
import { Cavalo } from '../entities/Cavalos';
import { FilterAnuncioDto } from '../../dto/anuncio.dto';

export class AnuncioRepository {
  private anuncioRepository: Repository<Anuncio>;
  private userRepository: Repository<User>;
  private cavaloRepository: Repository<Cavalo>;

  constructor() {
    this.anuncioRepository = AppDataSource.getRepository(Anuncio);
    this.userRepository = AppDataSource.getRepository(User);
    this.cavaloRepository = AppDataSource.getRepository(Cavalo);
  }

  async findAll(): Promise<Anuncio[]> {
    return await this.anuncioRepository.find({
      relations: ['vendedor', 'cavalo'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Anuncio | null> {
    return await this.anuncioRepository.findOne({
      where: { id },
      relations: ['vendedor', 'cavalo']
    });
  }

  async findByFilters(filters: FilterAnuncioDto): Promise<Anuncio[]> {
    const whereCondition: any = {};

    if (filters.ativo !== undefined) {
      whereCondition.ativo = filters.ativo;
    }

    if (filters.tipo) {
      whereCondition.tipo = filters.tipo;
    }

    if (filters.precoMin !== undefined && filters.precoMax !== undefined) {
      whereCondition.preco = Between(filters.precoMin, filters.precoMax);
    } else if (filters.precoMin !== undefined) {
      whereCondition.preco = MoreThanOrEqual(filters.precoMin);
    } else if (filters.precoMax !== undefined) {
      whereCondition.preco = LessThanOrEqual(filters.precoMax);
    }

    if (filters.vendedorId) {
      whereCondition.vendedor = { id: filters.vendedorId };
    }

    if (filters.cavaloId) {
      whereCondition.cavalo = { id: filters.cavaloId };
    }

    return await this.anuncioRepository.find({
      where: whereCondition,
      relations: ['vendedor', 'cavalo'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByVendedorId(vendedorId: string): Promise<Anuncio[]> {
    return await this.anuncioRepository.find({
      where: { vendedor: { id: vendedorId } },
      relations: ['vendedor', 'cavalo'],
      order: { createdAt: 'DESC' }
    });
  }

  async create(anuncioData: Partial<Anuncio>): Promise<Anuncio> {
    const anuncio = this.anuncioRepository.create(anuncioData);
    return await this.anuncioRepository.save(anuncio);
  }

  async update(id: string, anuncioData: Partial<Anuncio>): Promise<Anuncio | null> {
    await this.anuncioRepository.update(id, anuncioData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.anuncioRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }

  async findCavaloById(cavaloId: string): Promise<Cavalo | null> {
    return await this.cavaloRepository.findOne({
      where: { id: cavaloId }
    });
  }

  async markAsInactive(id: string): Promise<Anuncio | null> {
    await this.anuncioRepository.update(id, { ativo: false });
    return await this.findById(id);
  }

  async markAsActive(id: string): Promise<Anuncio | null> {
    await this.anuncioRepository.update(id, { ativo: true });
    return await this.findById(id);
  }

  async count(): Promise<number> {
    return await this.anuncioRepository.count();
  }

  async countActive(): Promise<number> {
    return await this.anuncioRepository.count({
      where: { ativo: true }
    });
  }
}

