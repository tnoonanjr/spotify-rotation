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
  - If you dont have Node.js already, install it (refrence Prerequisites above)
  ### For local development:
   - Clone the repositiory
    - Replace the default Client ID with yours:
     ```javascript
     // Find this line and replace 'your-client-id'
     const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'your-client-id';
     ```
  ### For GitHub deployment:
   - Fork this repository
   - Go to your fork's Settings > Secrets and variables > Actions
   - Create a new repository secret named `SPOTIFY_CLIENT_ID` with your Client ID
   - Enable GitHub Actions in your repository
   - The playlist will update automatically based on the schedule in the workflow file
   - You can also manually trigger the workflow from the Actions tab



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
npm start -- -u "30 / 30" -l 30 -t short
```

* Creates a playlist named 30 / 30 with your top 30 most played songs in the past four weeks