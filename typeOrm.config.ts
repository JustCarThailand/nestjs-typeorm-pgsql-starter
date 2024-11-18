import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST', { infer: true }),
  port: configService.get('DB_PORT', { infer: true }),
  database: configService.get('DB_DATABASE', { infer: true }),
  username: configService.get('DB_USERNAME', { infer: true }),
  password: configService.get('DB_PASSWORD', { infer: true }),
  migrations: ['./migrations/**'],
  entities: ['./src/entities/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
});
