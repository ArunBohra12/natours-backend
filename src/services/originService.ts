import { QueryResult } from 'pg';

import { Origin } from 'model/originModel';
import getNewPool from '@config/db/dbConfig';
import ApiError from '@core/errors/apiError';
import logger from '@core/logger/logger';

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
    const err = new ApiError(
      'Error in fetching origins',
      500,
      'DatabaseError',
      'Functional',
    );
    err.cause = error;

    logger.error(err.serialize());

    throw err;
  }
};

export default fetchOriginFromDatabase;
