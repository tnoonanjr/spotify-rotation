const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function getUserProfile(accessToken) {
    const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
}

export async function getUserPlaylists(accessToken, userId) {
    const response = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
}

export async function postUserPlaylist(accessToken, userId, playlistName, 
                                       playlistDescription) {
    const response = await fetch(`${SPOTIFY_API_BASE}/users/${userId}/playlists`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
        })
    });
    return await response.json();
}

export async function addToUserPlaylist(accessToken, playlistId, trackUris) {
    const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify({ uris: trackUris })
    });
    return await response.json();
}

export async function getUserTopTracks(accessToken, timeRange, limit) {
    const params = [];
    if (timeRange) params.push(`time_range=${timeRange}`);
    if (limit) params.push(`limit=${limit}`);
    const query = params.length ? `?${params.join('&')}` : '';
    const response = await fetch(`${SPOTIFY_API_BASE}/me/top/tracks${query}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
}