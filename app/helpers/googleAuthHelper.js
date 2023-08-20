import { google } from 'googleapis';

const AVAILABLE_SCOPES = {
  profile: 'profile',
};

class GoogleAuthHelper {
  constructor() {
    this._oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      `${process.env.SERVER_BASE_URL}/api/auth/google/redirect`
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
}

export default GoogleAuthHelper;
