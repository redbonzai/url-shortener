import { DataSource } from 'typeorm';
import { Url } from '../entities';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5434,
  username: 'local',
  password: 'local',
  database: 'test_e2e_db',
  entities: [Url],
  synchronize: true,
  dropSchema: true, // Automatically drops the schema at the end of each test
});
