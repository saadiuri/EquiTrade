import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../db/entities/User';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database');

    const userRepository = AppDataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log(`Database already has ${existingUsers} users. Skipping seed.`);
      console.log('Use npm run db:reset to clear and reseed');
      return;
    }

    // Create seed data
    const seedUsers = [
      {
        name: 'Admin User',
        email: 'admin@equitrade.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'João Silva',
        email: 'joao@equitrade.com', 
        password: 'password123',
        role: 'seller'
      },
      {
        name: 'Maria Santos',
        email: 'maria@equitrade.com',
        password: 'password123', 
        role: 'buyer'
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@equitrade.com',
        password: 'password123',
        role: 'breeder'
      }
    ];
    
    for (const userData of seedUsers) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    console.log(`Successfully seeded ${seedUsers.length} users!`);
    
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
