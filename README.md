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
   - Copy your **Client ID** and **Client Secret**

2. **Configuration** 
   ### For local deployment:
   - Clone the repository
   - Replace the default Client ID with yours:
     ```javascript
     // Find this line and replace 'your-client-id'
     const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'your-client-id';
     const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_ID || 'your-client-secret';
     ```

   ### GitHub workflow for automatic updates:
   - Fork the repository
   - Create your own GitHub repository secrets in Settings → Secrets and Variables → Actions:
     - `SPOTIFY_CLIENT_ID`: Your Spotify app client ID
     - `SPOTIFY_CLIENT_SECRET`: Your Spotify app client secret
     - `SPOTIFY_REFRESH_TOKEN`: A refresh token for your account (see below)
   - The workflow will _automagically_ run every Friday at midnight UTC-5 (New York) time!
   - You can also trigger it manually from the Actions tab

   #### Generating a refresh token:
   - Run the script locally first
   - This will create a `.spotify_token.json` file containing a refresh token
   - Use this refresh token value for your GitHub secret

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