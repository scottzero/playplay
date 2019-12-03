//song pojo
class Song{
  constructor(songData){
    this.title = songData.track.track_name
    this.artistName = songData.track.artist_name
    this.rating = songData.track.track_rating
    this.genre = songData.track.primary_genres.music_genre
    // console.log(this.genre)
    // console.log(this.genre = songData.track.primary_genres)
  }
}
module.exports = Song
