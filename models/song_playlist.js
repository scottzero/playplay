//playlist pojo
const database = require('../config')
const playlist = require('../models/playlist')

class songPlaylist{
  static add(favoriteID, playlistID) {
    return database('favorites_playlists').insert({favorite_id: favoriteID, playlist_id: playlistID}, "id")
  }

  static find(favoriteID, playlistID) {
    return database('favorites_playlists').where({favorite_id: favoriteID, playlist_id: playlistID})
  }

  static getPlaylistData(playlistID) {
    return database('favorites_playlists').where('playlist_id', playlistID)
      .join('favorites', {'favorites_playlists.favorite_id': 'favorites.id'})
      // .avg('rating')
  }

  static getFavorites(playlistID) {
    return database('favorites_playlists')
      .where('playlist_id', playlistID)
      .join('favorites', {'favorites_playlists.favorite_id': 'favorites.id'})
      .select('favorite_id as id', 'title', 'artistName', 'genre', 'rating')
  }


  static async summary(playlistID) {
    return {
      "id": playlistID,
      "title": await playlist.findPlaylist(playlistID).select('title').then(res => res[0].title),
      "songCount": await songPlaylist.getPlaylistData(playlistID).then(res => res.length),
      "songAvgRating": await songPlaylist.getPlaylistData(playlistID).avg('rating').then(res => Number(res[0].avg)),
      "favorites": await songPlaylist.getFavorites(playlistID),
      "createdAt": await playlist.findPlaylist(playlistID).select('created_at').then(res => res[0].created_at),
      "updatedAt": await playlist.findPlaylist(playlistID).select('updated_at').then(res => res[0].updated_at)
    }
  }
}

module.exports = songPlaylist;
