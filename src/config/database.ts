import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'equitrade',
  synchronize: process.env.NODE_ENV === 'development', // Auto-create schema in development
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, '..', 'entities', '*.{ts,js}')],
  subscribers: [join(__dirname, '..', 'subscribers', '*.{ts,js}')],
});

export default AppDataSource;
