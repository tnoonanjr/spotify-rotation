import fs from 'fs';
import { refreshAccessToken } from '../../src/auth/auth.js';

// Get refresh token from GitHub secrets
const refreshToken = process.env.REFRESH_TOKEN?.trim()
    .replace(/[\r\n\s]+/g, '')
    .replace(/[^\x20-\x7E]+/g, ''); 
if (!refreshToken) {
  console.error('REFRESH_TOKEN environment variable not set');
  process.exit(1);
}

try {
  const tokenData = await refreshAccessToken(refreshToken);
  
  fs.writeFileSync('/.spotify_token.json', JSON.stringify(tokenData, null, 2));
  
  console.log('✅ Successfully refreshed access token');
} catch (error) {
  console.error('Error refreshing token:', error);
  console.log(refreshToken.length);
  console.log('Contains line breaks:', refreshToken?.includes('\n'));
  process.exit(1);
}
