import { getUserProfile, getUserPlaylists, postUserPlaylist, addToUserPlaylist, getUserTopTracks } from "../src/spotify.js";
import { startServer } from "../src/auth/server.js";
import { parseArguments } from "../src/cli.js";

const args = process.argv.slice(2);
const options = parseArguments(args);

console.log('Playlist name:', options.playlistName);
console.log('Time range:', options.timeRange);
console.log('Limit:', options.limit);
console.log('Playlist description:', options.playlistDescription);

const tokenData = await startServer();
if (!tokenData)  {
    console.error('An error occured retrieving token data.');
    process.exit(1);
}
const accessToken = tokenData.access_token;
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
await addToUserPlaylist(accessToken, playlistId, trackUris);
console.log('🚀 Script run successfully!');