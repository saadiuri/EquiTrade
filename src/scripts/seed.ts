import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Comprador } from '../db/entities/Comprador';
import { Vendedor } from '../db/entities/Vendedor';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const compradorRepository = AppDataSource.getRepository(Comprador);
    const vendedorRepository = AppDataSource.getRepository(Vendedor);

    // Check if users already exist
    const existingCompradores = await compradorRepository.count();
    const existingVendedores = await vendedorRepository.count();
    
    if (existingCompradores > 0 || existingVendedores > 0) {
      console.log(`Database already has ${existingCompradores + existingVendedores} users. Skipping seed.`);
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

    console.log(`Successfully seeded ${compradores.length + vendedores.length} users!`);
    
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
