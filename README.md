# spotify-rotation
A CLI tool to create and update a Spotify playlist of your favorite songs.

Usage:
npm start -- [options]

Options:
  -n <name>      Create a new playlist with the given name
  -u <name>      Use an existing playlist with the given name
  -d <desc>      Set playlist description (max 250 chars)
  -t <range>     Time range for top tracks: short, medium, or long
  -l <number>    Limit number of tracks (1-50)
  -h, --help     Show this help message

Example:
npm start -- -u "30 / 30" -l 30 -t short

* Creates a playlist named 30 / 30 with your top 30 most played songs in the past four weeks