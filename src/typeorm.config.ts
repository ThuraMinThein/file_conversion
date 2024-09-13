import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Certificate } from './entities/certificate.entity';

const sslReject =
  process.env.MODE === 'Production'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null;

const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Certificate],
  ...sslReject,
  synchronize: true,
};

export default typeormConfig;
