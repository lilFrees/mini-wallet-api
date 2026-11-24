import 'dotenv/config';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './snake-naming.strategy';

// This file is loaded both by Nest (app.module.ts) and by the TypeORM CLI
// (migrations), which runs without Nest. That's why it reads .env itself via
// dotenv instead of using ConfigService.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// This folder, relative to the project root, with forward slashes. Absolute
// Windows paths break TypeORM's glob library when the drive letter's case
// differs from the working directory's (C: vs c:).
const here =
  path.relative(process.cwd(), __dirname).split(path.sep).join('/') || '.';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),

  // `here` is src/database under ts-node (CLI) and dist/database at runtime,
  // so the same globs work in both places.
  entities: [`${here}/../**/*.entity.{ts,js}`],
  migrations: [`${here}/migrations/*.{ts,js}`],

  namingStrategy: new SnakeNamingStrategy(),

  // Never let TypeORM change tables on its own; every schema change is a migration.
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};

export default new DataSource(dataSourceOptions);
