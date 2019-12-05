//playlist pojo

class Playlist{
  constructor(playlistData){
    this.id = playlistData.id;
    this.title = playlistData.title;
    this.createdAt = playlistData.created_at;
    this.updatedAt = playlistData.updated_at;
  }
}
module.exports = Playlist;
