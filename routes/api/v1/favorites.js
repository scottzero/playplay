const express = require('express');
const app = express();
const router= express.Router();
const database = require('../../../config')
const desiredData = require('../../../helpers/songs_helper')
const favorite = require('../../../models/song');

router.post('/', async (request, response)=>{
    if (request.body.title && request.body.artistName) {
      await favorite.findSongByAttributes(request.body.title, request.body.artistName)
        .then(res => {
          if (res.length) {
            return response.status(400).send({message: 'This song is already in your favorites list!'})
          } else {
            var useMeData = desiredData(request.body.title, request.body.artistName)
            .then(res => favorite.addSong(res))
            .then(res => response.status(201).send({ message: `${request.body.title} by ${request.body.artistName} has been added to your favorites!`}))
            .catch(error => response.status(500).send(error));
          }
      });
    } else {
      return response.status(400).send({message: 'There are some missing attributes in your request parameters.'});
    }
});

router.get('/', (request, response)=>{
  favorite.getSongs()
    .then(
      data => {
        if (data.length) {
          response.status(200).send(data)
        } else {
          response.status(200).send({message: "You haven't added any favorites yet!"})
        }
      }
    ).catch(error => response.status(500).send(error));
});

router.get('/:id', (request, response)=>{
  var songId = request.params.id;

  favorite.findSong(songId)
    .then(data => {
      if (data.length) {
        response.status(200).send(data)
      } else {
        response.status(404).send({message: "No favorite song is found with the given id. Please try another ID."})
      }
    })
    .catch(error => response.status(500).send(error));
});

router.delete('/:id', (request,response) =>{
  var songId = request.params.id;
  favorite.findSong(songId)
    .then(data => {
      if (data.length) {
        favorite.findSong(songId).del()
        .then(res => response.send(204))
      } else {
        response.send(404, {message: "That song could not be deleted, because it does not exist."})
      }
    }).catch(error => response.status(500).send(error));
});

module.exports = router;
