export function parseArguments(args) {
    const usage = `
Usage: node rotation.js [options]

Options:
  -n <name>      Create a new playlist with the given name
  -u <name>      Use an existing playlist with the given name
  -d <desc>      Set playlist description (max 250 chars)
  -t <range>     Time range for top tracks: short, medium, or long
  -l <number>    Limit number of tracks (1-50)
  -h, --help     Show this help message
`;

    if (args.includes('-h') || args.includes('--help')) {
        console.log(usage);
        process.exit(0);
    } else if (args.length === 0) {
        console.log(usage);
    }

    // Get args from command line
    let playlistName = null, timeRange = null, limit = null, playlistDescription = null;
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-d':
                playlistDescription = args[i + 1];
                i++;
                break;
            case '-l':
                limit = args[i + 1];
                i++;
                break;
            case '-n':
                playlistName = args[i + 1];
                i++;
                break;
            case '-t':
                timeRange = args[i + 1];
                i++;
                break;
            case '-u':
                playlistName = args[i + 1];
                i++;
                break;
        }
    }

    // Validate and map timeRange
    const validTimeRanges = {
        short: 'short_term',
        medium: 'medium_term',
        long: 'long_term'
    };
    if (timeRange) {
        const mapped = validTimeRanges[timeRange.toLowerCase()];
        if (!mapped) {
            console.error("Invalid time range. Use: short, medium, or long.");
            process.exit(1);
        }
        timeRange = mapped;
    }

    // Validate limit
    if (limit !== null) {
        limit = parseInt(limit, 10);
        if (isNaN(limit) || limit < 1 || limit > 50) {
            console.error("Limit must be a number between 1 and 50.");
            process.exit(1);
        }
    }

    // Validate playlistName length
    if (playlistName && playlistName.length > 100) {
        console.error("Playlist name must be 100 characters or fewer.");
        process.exit(1);
    }

    // Validate playlistDescription length
    if (playlistDescription && playlistDescription.length > 250) {
        console.error("Playlist description must be 250 characters or fewer.");
        process.exit(1);
    }

    // Make sure new and update flags are not used together
    if (args.includes('-n') && args.includes('-u')) {
        console.error("You cannot use both -n (new playlist) and -u (use existing playlist) at the same time.");
        process.exit(1);
    }
    
    // Set defaults
    if (!args.includes('-n') && !args.includes('-u')) {
        playlistName = 'Rotation Playlist';
    }
    if (!args.includes('-d')) {
        playlistDescription = 'scripted | javascript | created by tnoonanjr | https://github.com/tnoonanjr/spotify-rotation'; 
    }

    return {
        playlistName,
        timeRange,
        limit,
        playlistDescription,
        isUsingExisting: args.includes('-u')
    };
}