const env = require('dotenv').config();
const express = require('express');
const app = express();
const router= express.Router();
const database = require('../../../config')
const playlist = require('../../../models/playlist');
const favorite = require('../../../models/song');
const songPlaylist = require('../../../models/song_playlist');

router.post('/', async (request, response) => {
  if (request.body.title) {
    await playlist.findPlaylistByTitle(request.body.title)
      .then(res => {
        if (res.length) {
          return response.status(400).send({ message: 'Playlist titles should be unique.' })
        } else {
          playlist.addPlaylist(request)
          .then(res => response.status(201).send({ message: 'A new playlist has been created!' }))
          .catch(error => response.status(500).send(error));
        }
      })
  } else {
    return response.status(400).send({ message: 'Please add a title in string format.' })
  }
})

router.delete('/:id', (request, response)=>{
  var playlistId = request.params.id;

  playlist.findPlaylist(playlistId)
    .then(data => {
      if (data.length){
        playlist.findPlaylist(playlistId).del()
        .then(res => response.send(204))
      }else{
        response.send(404, {message: "That playlist could not be deleted, because it does not exist."})
        }
    }).catch(error => response.status(500).send(error));
  });

router.put('/:id', (request, response) => {
  playlist.findPlaylist(request.params.id)
    .then(res => {
      if (res.length) {
        playlist.findPlaylistByTitle(request.body.title)
        .then(song => {
          if (song.length) {
            return response.status(400).send({ message: 'Playlist titles should be unique.' })
          } else {
            playlist.updatePlaylist(request.params.id, request.body.title)
            .then(data => {
              var updatedPlaylist = new playlist(data[0])
              return response.status(200).json(updatedPlaylist)
            })
          }
        })
      } else {
        return response.status(404).send({ message: 'Playlist with the given id is not found.' })
      }
    })
    .catch(error => response.status(500).send(error));
})

router.get('/', (request, response) => {
  database('playlists').select()
  .then(res => {
    if (res.length) {
      var playlists = res.map(obj => { new playlist(obj) });
      return response.status(200).json(playlists);
    } else {
      return response.status(404).send({ message: "No playlist found"});
    }
  })
  .catch(error => response.status(500).send(error));
})

router.get('/:id', (request, response) => {
  playlist.findPlaylist(request.params.id).select()
  .then(res => {
    if (res.length) {
      var playlists = res.map(obj => { new playlist(obj) });
      return response.status(200).json(playlists);
    } else {
      return response.status(404).send({ message: "No playlist found"});
    }
  })
  .catch(error => response.status(500).send(error));
})

router.delete('/:id', (request, response)=>{
  var playlistId = request.params.id;

  playlist.findPlaylist(playlistId)
    .then(data => {
      if (data.length){
        playlist.findPlaylist(playlistId).del()
        .then(res => response.send(204))
      }else{
        response.send(404, {message: "That playlist could not be deleted, because it does not exist."})
        }
    }).catch(error => response.status(500).send(error));
  });

router.post('/:id/favorites/:fave_id', async (request, response) => {
  const playlistID = request.params.id;
  const favoriteID = request.params.fave_id;

  const temp_playlist = await playlist.findPlaylist(playlistID)
    .then(playlistData => {
        return playlistData[0]
    });

  const temp_favorite = await favorite.findSong(favoriteID)
    .then(songData => {
        return songData[0]
    });

  if (temp_playlist && temp_favorite) {
    songPlaylist.add(favoriteID, playlistID)
      .then(res => { response.status(201).send({Success: `${temp_favorite.title} has been added to ${temp_playlist.title}!`})})
      .catch(error => response.status(500).send(error));
  } else {
    return response.send(400, {message: "Either favorite song or playlist does not exist"})
  }
})

router.delete('/:id/favorites/:fave_id', async (request, response)=>{
  const playlistID = request.params.id;
  const favoriteID = request.params.fave_id;

  const temp_playlist = await playlist.findPlaylist(playlistID)
    .then(playlistData => {
        return playlistData[0]
    });

  const temp_favorite = await favorite.findSong(favoriteID)
    .then(songData => {
        return songData[0]
    });

  songPlaylist.find(favoriteID, playlistID)
    .then(res => {
      if (res.length) {
        songPlaylist.find(favoriteID, playlistID).del()
        .then(res => response.send(204))
      } else{
        response.send(404, {message: "That song could not be deleted, because it does not exist."})
      }
    })
    .catch(error => response.status(500).send(error));
});

module.exports = router;
