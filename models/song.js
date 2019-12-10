//song pojo
const database = require('../config')

class Song{
  constructor(songData){
    this.title = songData.track.track_name
    this.artistName = songData.track.artist_name
    this.rating = songData.track.track_rating
    this.genre = songData.track.primary_genres.music_genre_list[0].music_genre.music_genre_name
  }

  static findSong(id) {
    return database('favorites').where('id', id).columns(['id', 'title', 'artistName', 'genre', 'rating'])
  }

  static getSongs() {
    return database('favorites').columns(['id', 'title', 'artistName', 'genre', 'rating'])
  }

  static findSongByAttributes(title, artistName) {
    return database('favorites').where('title', title.toUpperCase()).where('artistName', artistName.toUpperCase())
  }

  static addSong(song) {
    return database('favorites').insert({
      title: song.title.toUpperCase(),
      artistName: song.artistName.toUpperCase(),
      rating: song.rating,
      genre: song.genre},
      "id")
  }
}
module.exports = Song
