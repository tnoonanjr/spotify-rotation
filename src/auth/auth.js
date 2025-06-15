import { URL } from 'url';
import { randomBytes } from 'crypto';

const CLIENT_ID = process.env.CLIENT_SECRET || 'your-client-id';
const CLIENT_SECRET = process.env.CLIENT_SECRET  || 'your-client-secret';
const scope = `user-read-private user-read-email playlist-read-private playlist-modify-public 
               playlist-modify-private user-top-read`;
          
export function generateCodeVerifier() {
    return randomBytes(64).toString('base64url');
}

export function getAuthUrl(state, redirectUri) {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);
    if (state) authUrl.searchParams.append('state', state);
    return authUrl.toString();
}

export async function exchangeCodeForToken(code, codeVerifier, redirectUri) {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    }).toString();

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 
            'Authorization' : `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body
    });

    if (!response.ok) {
        throw new Error(`Failed to exchange code for token: ${response.statusText}`);
    }
    
    return await response.json();
}


export async function refreshAccessToken(refreshToken) {
    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }).toString();

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 
            'Authorization' : `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    if (!response.ok) {
        throw new Error(`Failed to refresh access token: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}