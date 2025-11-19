import { CavaloRepository } from '../db/repositories/CavaloRepository';
import { Cavalo } from '../db/entities/Cavalos';
import { 
  CavaloDto, 
  CreateCavaloDto, 
  UpdateCavaloDto, 
  FilterCavaloDto 
} from '../dto/cavalo.dto';

export class CavaloService {
  private cavaloRepository: CavaloRepository;

  constructor() {
    this.cavaloRepository = new CavaloRepository();
  }

  async getAllCavalos(): Promise<CavaloDto[]> {
    const cavalos = await this.cavaloRepository.findAll();
    return cavalos.map(cavalo => this.toCavaloDto(cavalo));
  }

  async getCavaloById(id: string): Promise<CavaloDto | null> {
    const cavalo = await this.cavaloRepository.findById(id);
    return cavalo ? this.toCavaloDto(cavalo) : null;
  }

  async getCavalosByFilters(filters: FilterCavaloDto): Promise<CavaloDto[]> {
    const cavalos = await this.cavaloRepository.findByFilters(filters);
    return cavalos.map(cavalo => this.toCavaloDto(cavalo));
  }

  async getCavalosByDono(donoId: string): Promise<CavaloDto[]> {
    const cavalos = await this.cavaloRepository.findByDonoId(donoId);
    return cavalos.map(cavalo => this.toCavaloDto(cavalo));
  }

  async createCavalo(cavaloData: CreateCavaloDto): Promise<CavaloDto> {
    const dono = await this.cavaloRepository.findUserById(cavaloData.donoId);
    if (!dono) {
      throw new Error('Dono (owner) not found');
    }

    if (cavaloData.preco <= 0) {
      throw new Error('Price must be greater than zero');
    }

    if (cavaloData.idade <= 0 || cavaloData.idade > 50) {
      throw new Error('Age must be between 1 and 50 years');
    }

    // Destructure to separate donoId from other fields
    const { donoId, ...cavaloFields } = cavaloData;
    const cavaloToCreate: Partial<Cavalo> = {
      ...cavaloFields,
      disponivel: cavaloData.disponivel ?? true,
      dono: dono
    };

    const cavalo = await this.cavaloRepository.create(cavaloToCreate);
    return this.toCavaloDto(cavalo);
  }

  async updateCavalo(id: string, cavaloData: UpdateCavaloDto): Promise<CavaloDto | null> {
    const existingCavalo = await this.cavaloRepository.findById(id);
    if (!existingCavalo) {
      throw new Error('Cavalo not found');
    }

    if (cavaloData.preco !== undefined && cavaloData.preco <= 0) {
      throw new Error('Price must be greater than zero');
    }

    if (cavaloData.idade !== undefined && (cavaloData.idade <= 0 || cavaloData.idade > 50)) {
      throw new Error('Age must be between 1 and 50 years');
    }

    const updatedCavalo = await this.cavaloRepository.update(id, cavaloData);
    return updatedCavalo ? this.toCavaloDto(updatedCavalo) : null;
  }

  async deleteCavalo(id: string): Promise<boolean> {
    const existingCavalo = await this.cavaloRepository.findById(id);
    if (!existingCavalo) {
      throw new Error('Cavalo not found');
    }

    return await this.cavaloRepository.delete(id);
  }

  async markCavaloAsUnavailable(id: string): Promise<CavaloDto | null> {
    const existingCavalo = await this.cavaloRepository.findById(id);
    if (!existingCavalo) {
      throw new Error('Cavalo not found');
    }

    if (!existingCavalo.disponivel) {
      throw new Error('Cavalo is already unavailable');
    }

    const updatedCavalo = await this.cavaloRepository.markAsUnavailable(id);
    return updatedCavalo ? this.toCavaloDto(updatedCavalo) : null;
  }

  async markCavaloAsAvailable(id: string): Promise<CavaloDto | null> {
    const existingCavalo = await this.cavaloRepository.findById(id);
    if (!existingCavalo) {
      throw new Error('Cavalo not found');
    }

    if (existingCavalo.disponivel) {
      throw new Error('Cavalo is already available');
    }

    const updatedCavalo = await this.cavaloRepository.markAsAvailable(id);
    return updatedCavalo ? this.toCavaloDto(updatedCavalo) : null;
  }

  // Private mapping method
  private toCavaloDto(cavalo: Cavalo): CavaloDto {
    return {
      id: cavalo.id,
      nome: cavalo.nome,
      idade: cavalo.idade,
      raca: cavalo.raca,
      preco: Number(cavalo.preco), // Convert decimal to number
      descricao: cavalo.descricao,
      disponivel: cavalo.disponivel,
      premios: cavalo.premios,
      createdAt: cavalo.createdAt,
      updatedAt: cavalo.updatedAt,
      dono: {
        id: cavalo.dono.id,
        nome: cavalo.dono.nome,
        email: cavalo.dono.email
      }
    };
  }
}
