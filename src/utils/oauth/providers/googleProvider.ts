import { Auth, google } from 'googleapis';

import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_REDIRECT_URL,
  GOOGLE_AUTH_SCOPES,
} from '../providersConfig/googleProviderConfig';

class GoogleAuthProvider {
  private getAuthClient(): Auth.OAuth2Client {
    return new google.auth.OAuth2(
      GOOGLE_AUTH_CLIENT_ID,
      GOOGLE_AUTH_CLIENT_SECRET,
      GOOGLE_AUTH_REDIRECT_URL,
    );
  }

  public getAuthUrl() {
    const oAuth2Client = this.getAuthClient();
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
      scope: GOOGLE_AUTH_SCOPES,
    });
  }

  public async getAccessTokens(code: string) {
    const oAuth2Client = this.getAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);

    return tokens;
  }
}

export default GoogleAuthProvider;
