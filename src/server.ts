import logger from '@core/logger/logger';
import env from '@core/environment/environment';

import app from 'app';

app.listen(env.PORT, () =>
  logger.info(`Server is up and running on port ${env.PORT}`),
);
