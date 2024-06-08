import { registerAs } from '@nestjs/config';

export const AnimeVsubConfig = registerAs('animevsub', () => ({
  endpoint: process.env.ANIMEVSUB_ENDPOINT,
}));

export const AnimeHayConfig = registerAs('animehay', () => ({
  endpoint: process.env.ANIMEHAY_ENDPOINT,
}));

export const TriggerConfig = registerAs('trigger', () => ({
  secret: process.env.TRIGGER_SECRET_KEY,
}));

export const DatabaseConfig = registerAs('database', () => ({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(`${process.env.PG_PORT}`) || 5432,
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [`${__dirname}/../**/*.model{.ts,.js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
}));
