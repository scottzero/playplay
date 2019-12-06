const env = require('dotenv').config();
const express = require('express');
const app = express();
const router= express.Router();
const database = require('../../../config')
const playlistPojo = require('../../../models/playlist');

router.post('/', (request, response) => {
  if (request.body.title) {
    database('playlists').where('title', request.body.title)
      .then(res => {
        if (res.length) {
          return response.status(400).send({ message: 'Playlist titles should be unique.' })
        } else {
          database('playlists').insert({
            title: request.body.title
          }, "id")
          .then(res => response.status(201).send({ message: 'A new playlist has been created!' }))
          .catch(error => response.status(500).send(error));
        }
      })
  } else {
    return response.status(400).send({ message: 'Please add a title in string format.' })
  }
})

router.put('/:id', (request, response) => {
  database('playlists').where('id', request.params.id)
    .then(res => {
      if (res.length) {
        database('playlists').where('title', request.body.title)
        .then(song => {
          if (song.length) {
            return response.status(400).send({ message: 'Playlist titles should be unique.' })
          } else {
            database('playlists').where('id', request.params.id).update({
              title: request.body.title
            }).returning('*')
            .then(data => {
              var updatedPlaylist = new playlistPojo(data[0])
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
      var playlists = res.map(obj => {
        return new playlistPojo(obj)
      });

      return response.status(200).json(playlists);
    } else {
      return response.status(404).send({ message: "No playlist found"});
    }
  })
  .catch(error => response.status(500).send(error));
})

router.get('/:id', (request, response) => {
  database('playlists').where('id', request.params.id).select()
  .then(res => {
    if (res.length) {
      var playlists = res.map(obj => {
        return new playlistPojo(obj)
      });

      return response.status(200).json(playlists);
    } else {
      return response.status(404).send({ message: "No playlist found"});
    }
  })
  .catch(error => response.status(500).send(error));
})

module.exports = router;
