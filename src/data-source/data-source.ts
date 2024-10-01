import { DataSource } from 'typeorm';
import { join } from 'path';
import { Url } from '../entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'url_shortener',
  entities: [Url],
  // eslint-disable-next-line no-undef
  migrations: [join(__dirname + '/../migrations/*{.ts,.js}')],
  synchronize: true,
});

// Call initialize only if necessary, usually within your app's entry point.
AppDataSource.initialize()
  .then(() => {
    // eslint-disable-next-line no-undef
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    // eslint-disable-next-line no-undef
    console.error('Error during Data Source initialization', err);
  });
