import { URL } from 'url';
import { randomBytes, createHash } from 'crypto';

const CLIENT_ID = '6390a0de4f5e4558969e210d9e01b549'; 
const scope = `user-read-private user-read-email playlist-read-private playlist-modify-public 
               playlist-modify-private user-top-read`;

export function generateCodeVerifier() {
    return randomBytes(64).toString('base64url');
}

export function generateCodeChallenge(codeVerifier) {
    return createHash('sha256').update(codeVerifier).digest('base64url');
}

export function getAuthUrl(codeChallenge, state, redirectUri) {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', CLIENT_ID);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    if (state) authUrl.searchParams.append('state', state);
    return authUrl.toString();
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code, codeVerifier, redirectUri) {
    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
    }).toString();

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });
    return await response.json();
}
