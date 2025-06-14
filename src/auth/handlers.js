import { exchangeCodeForToken, generateCodeVerifier, getAuthUrl } from './auth.js';
import fs from 'fs';

export async function rootHandler(response, codeVerifiers, REDIRECT_URI) {
    
    const codeVerifier = generateCodeVerifier();

    const state = Math.random().toString(36).substring(2, 15);
    codeVerifiers[state] = codeVerifier;
    
    const authUrl = getAuthUrl(state, REDIRECT_URI);
    response.writeHead(302, { 'Location': authUrl });
    response.end();
}

export async function callbackHandler(requestUrl, response, codeVerifiers, 
                                      REDIRECT_URI, tokenDataCallback) {
   
    const code = requestUrl.searchParams.get('code');
    const state = requestUrl.searchParams.get('state');
    const codeVerifier = codeVerifiers[state];

    if (code && codeVerifier) {
        const tokenData = await exchangeCodeForToken(code, codeVerifier, REDIRECT_URI);

        // Save token data to a file
        fs.writeFileSync('.spotify_token.json', JSON.stringify(tokenData, null, 2));
        console.log('Token data saved to .spotify_token.json');

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(`
        <html>
            <head><title>Spotify Authentication Successful</title></head>
            <script> setTimeout(() => { window.close(); }, 1000); </script> 
        </html>
        `);

        delete codeVerifiers[state];
        
        // Callback with tokenData
        if (tokenDataCallback) tokenDataCallback(tokenData); 
    } else {
        const error = requestUrl.searchParams.get('error');
        response.writeHead(400);
        response.end(`Error: ${error || 'No code or state provided'}`);
    }
}