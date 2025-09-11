import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Comprador } from '../db/entities/Comprador';
import { Vendedor } from '../db/entities/Vendedor';
import { Anuncio } from '../db/entities/Anuncio';
import { Cavalo } from '../db/entities/Cavalos';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const compradorRepository = AppDataSource.getRepository(Comprador);
    const vendedorRepository = AppDataSource.getRepository(Vendedor);
    const cavaloRepository = AppDataSource.getRepository(Cavalo);
    const anuncioRepository = AppDataSource.getRepository(Anuncio);

    // Verifica se já tem registros
    const existingCompradores = await compradorRepository.count();
    const existingVendedores = await vendedorRepository.count();
    const existingCavalos = await cavaloRepository.count();
    const existingAnuncios = await anuncioRepository.count();

    if (existingCompradores > 0 || existingVendedores > 0 || existingCavalos > 0 || existingAnuncios > 0) {
      console.log('Database já possui dados. Skipping seed.');
      console.log('Use npm run db:reset para limpar e reseed.');
      return;
    }

    // Compradores
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

    // Vendedores
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
    let vendedorPrincipal: Vendedor | null = null;
    for (const vendedorData of vendedores) {
      const vendedor = vendedorRepository.create(vendedorData);
      await vendedorRepository.save(vendedor);
      console.log(`Created vendedor: ${vendedor.email} (nota: ${vendedor.nota})`);

      if (!vendedorPrincipal) vendedorPrincipal = vendedor; // pega o primeiro vendedor
    }

    if (!vendedorPrincipal) {
      throw new Error('Nenhum vendedor criado!');
    }

    // Cavalos vinculados ao vendedorPrincipal
    const cavalos = [
      {
        nome: 'Relâmpago',
        idade: 5,
        raca: 'Mangalarga Marchador',
        preco: 15000.00,
        descricao: 'Cavalo dócil, excelente para cavalgadas.',
        dono: vendedorPrincipal
      },
      {
        nome: 'Trovão',
        idade: 7,
        raca: 'Quarto de Milha',
        preco: 25000.00,
        descricao: 'Cavalo de corrida, muito veloz e treinado.',
        dono: vendedorPrincipal
      }
    ];

    let cavaloPrincipal: Cavalo | null = null;
    for (const cavaloData of cavalos) {
      const cavalo = cavaloRepository.create(cavaloData);
      await cavaloRepository.save(cavalo);
      console.log(`Created cavalo: ${cavalo.nome}`);

      if (!cavaloPrincipal) cavaloPrincipal = cavalo; // pega o primeiro cavalo
    }

    if (!cavaloPrincipal) {
      throw new Error('Nenhum cavalo criado!');
    }

    // Anúncio para o cavaloPrincipal
    const anuncioCavalo = anuncioRepository.create({
    titulo: `Venda do cavalo ${cavaloPrincipal.nome}`,
    descricao: `Cavalo da raça ${cavaloPrincipal.raca}, ${cavaloPrincipal.idade} anos, em excelente estado.`,
    tipo: 'CAVALO',
    cavalo: cavaloPrincipal,
    vendedor: vendedorPrincipal,
    ativo: true
    });

    await anuncioRepository.save(anuncioCavalo);
    console.log(`Created anuncio de cavalo: ${anuncioCavalo.titulo}`);

    console.log('✅ Seed finalizado com sucesso!');

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export default seed;
