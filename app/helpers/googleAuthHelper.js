import { google } from 'googleapis';
import logger from '../logger/logger.js';

const AVAILABLE_SCOPES = {
  profile: 'https://www.googleapis.com/auth/userinfo.profile',
  email: 'https://www.googleapis.com/auth/userinfo.email',
};

class GoogleAuthHelper {
  constructor() {
    this._oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL.replace('{{BASE_URL}}', process.env.CLIENT_APP_BASE_URL)
    );

    this.scopes = [];
  }

  addScopes(...scopes) {
    scopes.forEach(scope => {
      if (AVAILABLE_SCOPES[scope]) {
        this.scopes.push(AVAILABLE_SCOPES[scope]);
      }
    });

    return this;
  }

  generateAuthUrl() {
    const authUrl = this._oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      scope: this.scopes,
    });

    return authUrl;
  }

  async getAuthTokens(code) {
    const { tokens } = await this._oauth2Client.getToken(code);
    return tokens;
  }

  async getUserProfile(refreshToken) {
    // Set the refresh token
    this._oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
      // Fetch user profile using the new access token
      const people = google.people({ version: 'v1', auth: this._oauth2Client });

      const response = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,photos,emailAddresses',
      });

      return response.data;
    } catch (error) {
      logger.error(JSON.stringify(error));
      return false;
    }
  }
}

export default GoogleAuthHelper;
