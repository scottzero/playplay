//playlist pojo
const database = require('../config')

class Playlist{
  constructor(playlistData){
    this.id = playlistData.id;
    this.title = playlistData.title;
    this.createdAt = playlistData.created_at;
    this.updatedAt = playlistData.updated_at;
  }

  static all() {
    return database('playlists').select('id').map(obj => obj.id)
  }

  static findPlaylist(id) {
    return database('playlists').where('id', id)
  }

  static findPlaylistByTitle(title) {
    return database('playlists').where('title', title)
  }

  static addPlaylist(req) {
    return database('playlists').insert({
      title: req.body.title
    }, "id")
  }

  static updatePlaylist(id, title) {
    return database('playlists').where('id', id).update({
      title: title
    }).returning('*')
  }
}
module.exports = Playlist;
