import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`);
dotenv.config({ path: envPath });

console.log(`Loading environment from: ${envPath}`);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: 'postgres';
}

const dbConfig: DatabaseConfig = {
  database: process.env.DB_DATABASE!,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  host: process.env.DB_HOST!,
  dialect: 'postgres',
};

for (const [key, value] of Object.entries(dbConfig)) {
  if (!value && key !== 'password') {
    console.error(`Missing database config value for ${key}`);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Continuing in development mode with incomplete config');
      break;
    } else {
      throw new Error(`Missing database config value for ${key}`);
    }
  }
}

export const sequelize = new Sequelize({
  ...dbConfig,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Database connection established'))
  .catch((err) => console.error('Unable to connect to the database:', err));
