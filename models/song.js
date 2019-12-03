//song pojo
class Song{
  constructor(songData){
    this.title = songData.track.track_name
    this.artistName = songData.track.artist_name
    this.rating = songData.track.track_rating
    this.genre = songData.track.primary_genres.music_genre_list[0].music_genre.music_genre_name
  }
}
module.exports = Song
