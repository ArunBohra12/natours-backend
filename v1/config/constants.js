const clientUrl =
  process.env.NODE_ENV === 'production' ? process.env.CLIENT_APP_BASE_URL : 'http://127.0.0.1:5173';

exports.CLIENT_BASE_URL = clientUrl;
