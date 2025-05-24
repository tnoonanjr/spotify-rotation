import http from 'http';
import { URL } from 'url';
import { exec } from 'child_process';
import * as authHelpers from './auth.js';
import { rootHandler, callbackHandler } from './handlers.js';

const PORT = 4242;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const codeVerifiers = {};

export function startServer() {
    return new Promise((resolve) => {
        const server = http.createServer(async (request, response) => {
            const requestUrl = new URL(request.url, `http://localhost:${PORT}`);
            const pathname = requestUrl.pathname;

            switch (pathname) {
                case '/':
                    await rootHandler(response, codeVerifiers, REDIRECT_URI, 
                                      authHelpers);
                    break;
                case '/callback':
                    await callbackHandler(
                        requestUrl, response, codeVerifiers,
                        REDIRECT_URI, authHelpers,
                        (tokenData) => { server.close(); resolve(tokenData); } );
                    break;
                default:
                    response.writeHead(404);
                    response.end('Not found');
            }
        });

        server.listen(PORT, () => {
            const openCommand = process.platform === 'win32' ? 'start' :
                                process.platform === 'darwin' ? 'open' : 'xdg-open';
            exec(`${openCommand} http://localhost:${PORT}/`);
        });
    });
}