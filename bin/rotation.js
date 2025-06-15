import { getUserProfile, getUserPlaylists, postUserPlaylist, 
         addToUserPlaylist, getUserTopTracks, replacePlaylistItems } from "../src/spotify.js";
import { startServer } from "../src/auth/server.js";
import { parseArguments } from "../src/cli.js";
import { refreshAccessToken } from "../src/auth/auth.js";
import fs from 'fs';

const args = process.argv.slice(2);
const options = parseArguments(args);

console.log('Playlist name:', options.playlistName);
console.log('Time range:', options.timeRange);
console.log('Limit:', options.limit);
console.log('Playlist description:', options.playlistDescription);

let accessToken, tokenData;

async function authenticate() {
  if (process.env.SPOTIFY_REFRESH_TOKEN) {
    console.log('Using environment variables to refresh access token...');
    return await refreshAccessToken(process.env.SPOTIFY_REFRESH_TOKEN);
  }
  
  if (fs.existsSync('.spotify_token.json')) {
    try {
      const tokenJson = fs.readFileSync('.spotify_token.json', 'utf-8');
      const cachedTokenData = JSON.parse(tokenJson);
      console.log('Using cached token data...');
      return await refreshAccessToken(cachedTokenData.refresh_token);
    } catch (error) {
      console.error('An error occurred reading cached token data:', error);
    }
  }
  
  console.log('Starting authentication server...');
  return await startServer();
}

try {
  tokenData = await authenticate();
  accessToken = tokenData.access_token;
  
  console.log('\n✅ Authentication successful!');

  // Get user profile
  const user = await getUserProfile(accessToken);
  const userId = user.id;
  console.log(`👋 Hello ${user.display_name}`);

  // Get user playlists
  const playlists = await getUserPlaylists(accessToken, userId);
  let playlistId = null;
  if (options.isUsingExisting) {
    const playlist = playlists.items.find(pl => pl.name === options.playlistName);
    if (!playlist) {
        console.error(`Playlist "${options.playlistName}" not found`);
        process.exit(1);
    }
    playlistId = playlist.id;

    console.log(`Using existing playlist: ${options.playlistName}...`);
  } else {
    const playlist = await postUserPlaylist(accessToken, userId, options.playlistName, options.playlistDescription, true);
    playlistId = playlist.id;
    console.log(`Creating playlist: ${playlist.name}...`);
  }

  // Get user top tracks
  const userTopTracks = await getUserTopTracks(accessToken, options.timeRange, options.limit);
  console.log('Adding tracks:', userTopTracks.items.map(track => track.name).join(' | '));

  // Add tracks to the playlist
  const trackUris = userTopTracks.items.map(track => track.uri);
  if (options.isUsingExisting) {
    await replacePlaylistItems(accessToken, playlistId, trackUris);
  } else {
    await addToUserPlaylist(accessToken, playlistId, trackUris);
  }
  console.log('🚀 Script run successfully!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}