import { AnuncioRepository } from '../db/repositories/AnuncioRepository';
import { Anuncio } from '../db/entities/Anuncio';
import { 
  AnuncioDto, 
  CreateAnuncioDto, 
  UpdateAnuncioDto, 
  FilterAnuncioDto 
} from '../dto/anuncio.dto';

export class AnuncioService {
  private anuncioRepository: AnuncioRepository;

  constructor() {
    this.anuncioRepository = new AnuncioRepository();
  }

  async getAllAnuncios(): Promise<AnuncioDto[]> {
    const anuncios = await this.anuncioRepository.findAll();
    return anuncios.map(anuncio => this.toAnuncioDto(anuncio));
  }

  async getAnuncioById(id: string): Promise<AnuncioDto | null> {
    const anuncio = await this.anuncioRepository.findById(id);
    if (!anuncio) {
      throw new Error('Anúncio not found');
    }
    return this.toAnuncioDto(anuncio);
  }

  async getAnunciosByFilters(filters: FilterAnuncioDto): Promise<AnuncioDto[]> {
    const anuncios = await this.anuncioRepository.findByFilters(filters);
    return anuncios.map(anuncio => this.toAnuncioDto(anuncio));
  }

  async getAnunciosByVendedor(vendedorId: string): Promise<AnuncioDto[]> {
    const vendedor = await this.anuncioRepository.findUserById(vendedorId);
    if (!vendedor) {
      throw new Error('Seller not found');
    }

    const anuncios = await this.anuncioRepository.findByVendedorId(vendedorId);
    return anuncios.map(anuncio => this.toAnuncioDto(anuncio));
  }

  async createAnuncio(anuncioData: CreateAnuncioDto): Promise<AnuncioDto> {
    const vendedor = await this.anuncioRepository.findUserById(anuncioData.vendedorId);
    if (!vendedor) {
      throw new Error('Seller not found');
    }

    const cavalo = await this.anuncioRepository.findCavaloById(anuncioData.cavaloId);
    if (!cavalo) {
      throw new Error('Horse not found');
    }

    if (anuncioData.preco <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const { vendedorId, cavaloId, ...anuncioFields } = anuncioData;
    const anuncioToCreate = {
      ...anuncioFields,
      ativo: anuncioData.ativo ?? true,
      vendedor,
      cavalo
    };

    const anuncio = await this.anuncioRepository.create(anuncioToCreate);
    return this.toAnuncioDto(anuncio);
  }

  async updateAnuncio(id: string, anuncioData: UpdateAnuncioDto): Promise<AnuncioDto | null> {
    const existingAnuncio = await this.anuncioRepository.findById(id);
    if (!existingAnuncio) {
      throw new Error('Anúncio not found');
    }

    if (anuncioData.preco !== undefined && anuncioData.preco <= 0) {
      throw new Error('Price must be greater than zero');
    }

    const updatedAnuncio = await this.anuncioRepository.update(id, anuncioData);
    return updatedAnuncio ? this.toAnuncioDto(updatedAnuncio) : null;
  }

  async deleteAnuncio(id: string): Promise<boolean> {
    const existingAnuncio = await this.anuncioRepository.findById(id);
    if (!existingAnuncio) {
      throw new Error('Anúncio not found');
    }

    return await this.anuncioRepository.delete(id);
  }

  async markAnuncioAsInactive(id: string): Promise<AnuncioDto | null> {
    const existingAnuncio = await this.anuncioRepository.findById(id);
    if (!existingAnuncio) {
      throw new Error('Anúncio not found');
    }

    if (!existingAnuncio.ativo) {
      throw new Error('Anúncio is already inactive');
    }

    const updatedAnuncio = await this.anuncioRepository.markAsInactive(id);
    return updatedAnuncio ? this.toAnuncioDto(updatedAnuncio) : null;
  }

  async markAnuncioAsActive(id: string): Promise<AnuncioDto | null> {
    const existingAnuncio = await this.anuncioRepository.findById(id);
    if (!existingAnuncio) {
      throw new Error('Anúncio not found');
    }

    if (existingAnuncio.ativo) {
      throw new Error('Anúncio is already active');
    }

    const updatedAnuncio = await this.anuncioRepository.markAsActive(id);
    return updatedAnuncio ? this.toAnuncioDto(updatedAnuncio) : null;
  }

  /**
   * @description Converte um objeto Anuncio para um objeto AnuncioDto
   * @param anuncio - O objeto Anuncio a ser convertido
   * @returns O objeto AnuncioDto convertido
   */
  private toAnuncioDto(anuncio: Anuncio): AnuncioDto {
    const { id: vendedorId, nome: vendedorNome, email: vendedorEmail } = anuncio.vendedor;
    const { id: cavaloId, nome: cavaloNome, raca, idade } = anuncio.cavalo;

    return {
      ...anuncio,
      preco: Number(anuncio.preco),
      vendedor: {
        id: vendedorId,
        nome: vendedorNome,
        email: vendedorEmail
      },
      cavalo: {
        id: cavaloId,
        nome: cavaloNome,
        raca,
        idade
      }
    };
  }
}

