import { Pool } from 'pg';

import env from '@core/environment/environment';

const getNewPool = (): Pool => {
  const pool = new Pool({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    database: env.DATABASE_NAME,
    password: env.DATABASE_PASSWORD,
    port: Number(env.DATABASE_PORT),
  });

  return pool;
};

export default getNewPool;
