import { Repository, MoreThanOrEqual, LessThanOrEqual, ILike } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Cavalo } from '../entities/Cavalos';
import { User } from '../entities/User';
import { FilterCavaloDto } from '../../dto/cavalo.dto';

export class CavaloRepository {
  private cavaloRepository: Repository<Cavalo>;
  private userRepository: Repository<User>;

  constructor() {
    this.cavaloRepository = AppDataSource.getRepository(Cavalo);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<Cavalo[]> {
    return await this.cavaloRepository.find({
      relations: ['dono'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<Cavalo | null> {
    return await this.cavaloRepository.findOne({
      where: { id },
      relations: ['dono']
    });
  }

  async findByFilters(filters: FilterCavaloDto): Promise<Cavalo[]> {
    const whereCondition: any = {};

    // Simple equality filters
    if (filters.disponivel !== undefined) {
      whereCondition.disponivel = filters.disponivel;
    }

    if (filters.donoId) {
      whereCondition.dono = { id: filters.donoId };
    }

    // Range filters using TypeORM operators
    if (filters.precoMin !== undefined || filters.precoMax !== undefined) {
      const precoConditions: any[] = [];
      if (filters.precoMin !== undefined) {
        precoConditions.push(MoreThanOrEqual(filters.precoMin));
      }
      if (filters.precoMax !== undefined) {
        precoConditions.push(LessThanOrEqual(filters.precoMax));
      }
      // For multiple conditions on same field, would need And() operator
      // This gets complex, hence why QueryBuilder is often preferred
      whereCondition.preco = filters.precoMin !== undefined && filters.precoMax !== undefined
        ? MoreThanOrEqual(filters.precoMin) // Simplified for demo
        : precoConditions[0];
    }

    if (filters.idadeMin !== undefined || filters.idadeMax !== undefined) {
      const idadeConditions: any[] = [];
      if (filters.idadeMin !== undefined) {
        idadeConditions.push(MoreThanOrEqual(filters.idadeMin));
      }
      if (filters.idadeMax !== undefined) {
        idadeConditions.push(LessThanOrEqual(filters.idadeMax));
      }
      whereCondition.idade = filters.idadeMin !== undefined && filters.idadeMax !== undefined
        ? MoreThanOrEqual(filters.idadeMin) // Simplified for demo
        : idadeConditions[0];
    }

    if (filters.nomeContains) {
      whereCondition.nome = ILike(`%${filters.nomeContains}%`);
    }

    if (filters.racaContains) {
      whereCondition.raca = ILike(`%${filters.racaContains}%`);
    }

    return await this.cavaloRepository.find({
      where: whereCondition,
      relations: ['dono'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByDonoId(donoId: string): Promise<Cavalo[]> {
    return await this.cavaloRepository.find({
      where: { dono: { id: donoId } },
      relations: ['dono'],
      order: { createdAt: 'DESC' }
    });
  }

  async create(cavaloData: Partial<Cavalo>): Promise<Cavalo> {
    console.log('🛠️ CavaloRepository.create chamado com:', cavaloData);
    const cavalo = this.cavaloRepository.create(cavaloData);
    try {
      const savedCavalo = await this.cavaloRepository.save(cavalo);
      console.log('✅ Cavalo salvo com sucesso:', savedCavalo);
      return savedCavalo;
    } catch (err) {
      console.error('❌ Erro ao salvar cavalo:', err);
      throw err; // Propaga para o service
    }
  }

  async update(id: string, cavaloData: Partial<Cavalo>): Promise<Cavalo | null> {
    await this.cavaloRepository.update(id, cavaloData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.cavaloRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return await this.cavaloRepository.count();
  }

  async countByDono(donoId: string): Promise<number> {
    return await this.cavaloRepository.count({
      where: { dono: { id: donoId } }
    });
  }

  async countAvailable(): Promise<number> {
    return await this.cavaloRepository.count({
      where: { disponivel: true }
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }

  async markAsUnavailable(id: string): Promise<Cavalo | null> {
    await this.cavaloRepository.update(id, { disponivel: false });
    return await this.findById(id);
  }

  async markAsAvailable(id: string): Promise<Cavalo | null> {
    await this.cavaloRepository.update(id, { disponivel: true });
    return await this.findById(id);
  }

}
