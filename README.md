# spotify-rotation
A CLI tool to create and update a Spotify playlist of your favorite songs.

## Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- A Spotify account

## Setup
1. **Create a Spotify Developer Application**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Click "Create An App"
   - Fill in the app name (e.g., "Spotify Rotation") and description
   - Add `http://127.0.0.1:4242/callback` as a Redirect URI (or change the PORT var. to fit your custom URI)
   - Copy your **Client ID**

2. **Configuration**
   - If you don't have Node.js already, install it (reference Prerequisites above)
   
   ### For local development:
   - Clone the repository
   - Replace the default Client ID with yours:
     ```javascript
     // Find this line and replace 'your-client-id'
     const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'your-client-id';
     ```
   
   ### For GitHub deployment:
   1. Fork this repository
   2. Go to your fork's Settings > Secrets and variables > Actions
   3. Enable GitHub Actions in your repository
   4. Get a refresh token by running the app locally once
   5. Find the refresh token in the `.spotify_token.json` file that's created
   6. Add two secrets to your GitHub repository:
    - `SPOTIFY_CLIENT_ID`: Your Spotify application client ID
    - `SPOTIFY_REFRESH_TOKEN`: The refresh token from the file
   7. The workflow will:
    - Use the refresh token to get a new access token
    - Create/update your playlist on the scheduled time


## Usage:
```bash
npm start -- [options]
```

## Options:
| Option | Description |
|--------|-------------|
| `-n <name>` | Create a new playlist with the given name |
| `-u <name>` | Use an existing playlist with the given name |
| `-d <desc>` | Set playlist description (max 250 chars) |
| `-t <range>` | Time range for top tracks: short, medium, or long |
| `-l <number>` | Limit number of tracks (1-50) |
| `-h, --help` | Show this help message |

Example:

```bash
npm start -- -n "30 / 30" -l 30 -t short
```

* Creates a playlist named 30 / 30 with your top 30 most played songs in the past four weeks