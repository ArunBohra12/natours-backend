import { QueryResult } from 'pg';

import { Origin } from 'model/originModel';
import getNewPool from '@config/db/dbConfig';
import { databaseError } from '@core/errors/apiError';

/**
 * Fetches the origins from the database based on the provided role
 * @param type the type of origins to look up
 * @returns an array of origins
 */
const fetchOriginFromDatabase = async (origin: string): Promise<Origin[]> => {
  try {
    const result: QueryResult<Origin> = await getNewPool().query(
      `SELECT * FROM origins WHERE origin = '${origin}'`,
    );

    return result.rows;
  } catch (error) {
    throw databaseError('Error fetching origins', error.message);
  }
};

export default fetchOriginFromDatabase;
