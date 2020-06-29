import { createConnection } from 'typeorm';

/** create a test connection to the postgres database
 * where it recreates the schema on every connection
 */
export const testConnection = (drop: boolean = false) => {
  return createConnection({
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 9000,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + '/../entity/*.{ts,js}'],
  });
};
