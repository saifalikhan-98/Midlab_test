import { DataSource } from 'typeorm';
import { Image } from '../models/Image';
import { Comment } from '../models/Comment';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [Image, Comment],
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV !== 'production',
});

export const connectDatabase = async () => {
  try {
    console.log("data", env.DB_HOST, env.DB_NAME)
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  }
};