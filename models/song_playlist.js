//playlist pojo
const database = require('../config')

class songPlaylist{
  static add(favoriteID, playlistID) {
    return database('favorites_playlists').insert({favorite_id: favoriteID, playlist_id: playlistID}, "id")
  }
}

module.exports = songPlaylist;
