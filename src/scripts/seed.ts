import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Comprador } from '../db/entities/Comprador';
import { Vendedor } from '../db/entities/Vendedor';
import { Cavalo } from '../db/entities/Cavalos';
import { Anuncio } from '../db/entities/Anuncio';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const compradorRepository = AppDataSource.getRepository(Comprador);
    const vendedorRepository = AppDataSource.getRepository(Vendedor);
    const cavaloRepository = AppDataSource.getRepository(Cavalo);
    const anuncioRepository = AppDataSource.getRepository(Anuncio);

    // Check if data already exists
    const existingCompradores = await compradorRepository.count();
    const existingVendedores = await vendedorRepository.count();
    const existingCavalos = await cavaloRepository.count();
    
    if (existingCompradores > 0 || existingVendedores > 0 || existingCavalos > 0) {
      console.log(`Database already has data. Skipping seed.`);
      console.log('Use npm run db:reset to clear and reseed');
      return;
    }

    // Create compradores (buyers)
    const compradores = [
      {
        nome: 'Maria Santos',
        email: 'maria@equitrade.com',
        senha: 'password123',
        celular: '(11) 99999-1111',
        endereco: 'São Paulo, SP'
      },
      {
        nome: 'João Comprador',
        email: 'joao.comprador@equitrade.com',
        senha: 'password123',
        celular: '(21) 99999-2222',
        endereco: 'Rio de Janeiro, RJ'
      }
    ];

    // Create vendedores (sellers)
    const vendedores = [
      {
        nome: 'Pedro Oliveira',
        email: 'pedro@equitrade.com',
        senha: 'password123',
        celular: '(31) 99999-3333',
        endereco: 'Belo Horizonte, MG',
        nota: 4.5
      },
      {
        nome: 'Ana Vendedora',
        email: 'ana.vendedora@equitrade.com',
        senha: 'password123',
        celular: '(41) 99999-4444',
        endereco: 'Curitiba, PR',
        nota: 4.8
      }
    ];
    
    // Seed compradores
    for (const compradorData of compradores) {
      const comprador = compradorRepository.create(compradorData);
      await compradorRepository.save(comprador);
      console.log(`Created comprador: ${comprador.email}`);
    }

    // Seed vendedores
    for (const vendedorData of vendedores) {
      const vendedor = vendedorRepository.create(vendedorData);
      await vendedorRepository.save(vendedor);
      console.log(`Created vendedor: ${vendedor.email} (nota: ${vendedor.nota})`);
    }

    // Get created users for relationships
    const savedVendedores = await vendedorRepository.find();

    // Create cavalos (simplified for MVP)
    const cavalos = [
      {
        nome: 'Thunder',
        idade: 8,
        raca: 'Brasileiro de Hipismo',
        preco: 120000.00,
        descricao: 'Cavalo experiente em salto, participou de diversas competições nacionais',
        disponivel: true,
        premios: 'Campeão Regional de Salto 2023, 3º lugar Nacional 2022',
        dono: savedVendedores[0] // Pedro Oliveira
      },
      {
        nome: 'Elegance',
        idade: 6,
        raca: 'Hanoveriano Jojo',
        preco: 95000.00,
        descricao: 'Égua com excelente adestramento, movimentos harmoniosos',
        disponivel: true,
        premios: '2º lugar Regional de Adestramento 2023',
        dono: savedVendedores[1] // Ana Vendedora
      },
      {
        nome: 'Sereno',
        idade: 12,
        raca: 'Mangalarga Marchador',
        preco: 45000.00,
        descricao: 'Cavalo manso e confiável, ideal para cavalgadas e iniciantes',
        disponivel: true,
        premios: 'Campeão de Resistência Regional 2022',
        dono: savedVendedores[0] // Pedro Oliveira
      },
      {
        nome: 'Estrela',
        idade: 9,
        raca: 'Katchiau',
        preco: 38000.00,
        descricao: 'Égua dócil com boa resistência, perfeita para passeios',
        disponivel: true,
        premios: 'Participação em Exposições Locais',
        dono: savedVendedores[1] // Ana Vendedora
      }
    ];

    // Seed cavalos
    for (const cavaloData of cavalos) {
      const cavalo = cavaloRepository.create(cavaloData);
      await cavaloRepository.save(cavalo);
      console.log(`🐎 Created cavalo: ${cavalo.nome} (${cavalo.raca})`);
    }

    // Get created cavalos for anúncios
    const savedCavalos = await cavaloRepository.find();

    // Create anúncios (simplified for MVP - only sales)
    const anuncios = [
      {
        titulo: 'Thunder - Cavalo de Salto Campeão',
        descricao: 'Excelente cavalo para competições de salto. Muito bem treinado e com histórico de vitórias.',
        preco: 120000.00,
        ativo: true,
        vendedor: savedVendedores[0],
        cavalo: savedCavalos[0] // Thunder
      },
      {
        titulo: 'Elegance - Égua de Adestramento',
        descricao: 'Égua com excelente adestramento, movimentos harmoniosos e ótima para competições.',
        preco: 95000.00,
        ativo: true,
        vendedor: savedVendedores[1],
        cavalo: savedCavalos[1] // Elegance
      },
      {
        titulo: 'Sereno - Ideal para Iniciantes',
        descricao: 'Cavalo manso e confiável, perfeito para quem está começando na equitação.',
        preco: 45000.00,
        ativo: true,
        vendedor: savedVendedores[0],
        cavalo: savedCavalos[2] // Sereno
      },
      {
        titulo: 'Estrela - Égua para Passeios',
        descricao: 'Égua dócil com boa resistência, perfeita para passeios e cavalgadas.',
        preco: 38000.00,
        ativo: true,
        vendedor: savedVendedores[1],
        cavalo: savedCavalos[3] // Estrela
      }
    ];

    // Seed anúncios
    for (const anuncioData of anuncios) {
      const anuncio = anuncioRepository.create(anuncioData);
      await anuncioRepository.save(anuncio);
      console.log(`📢 Created anúncio: ${anuncio.titulo}`);
    }

    console.log(`Successfully seeded complete database!`);
    
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

// Run if called directly (ES module check)
if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export default seed;
