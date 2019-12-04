const env = require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const router= express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const getKey = (apikey) => {
  return process.env.apikey;
}
const songPojo = require('../../../models/song');

async function getSong(track, artist){
  const key = await getKey('apikey');
  let response = await fetch(`https://api.musixmatch.com/ws/1.1/matcher.track.get?q_track=${track}&q_artist=${artist}&apikey=${key}`)
  let song = await response.json();
  let data = await song.message.body
  return data;
}


async function desiredData(track, artist){
  var songData = await getSong(track, artist);
  var filteredSongData = await new songPojo(songData);
  return filteredSongData
}


router.post('/', (request, response)=>{
    if (request.body.title && request.body.artistName) {
      database('favorites').where('title', request.body.title.toUpperCase()).where('artistName', request.body.artistName.toUpperCase())
        .then(res => {
          if (res.length) {
            return response.status(400).send({message: 'This song is already in your favorites list!'})
          } else {
            var useMeData = desiredData(request.body.title, request.body.artistName)
            .then(res =>
              database('favorites').insert({
                title: res.title.toUpperCase(),
                artistName: res.artistName.toUpperCase(),
                rating: res.rating,
                genre: res.genre},
                "id")
            ).then(res => response.status(201).send({ message: `${request.body.title} by ${request.body.artistName} has been added to your favorites!`}))
            .catch(error => response.status(500).send(error));
          }
      });
    } else {
      return response.status(400).send({message: 'There are some missing attributes in your request parameters.'});
    }

});


router.get('/', (request, response)=>{
  database('favorites').columns(['title', 'artistName', 'genre', 'rating'])
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
  database('favorites').where('id', songId).columns(['title', 'artistName', 'genre', 'rating'])
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
  database('favorites').where('id', songId)
    .then(data => {
      if (data.length) {
        database('favorites').where('id', songId).del()
        .then(res => response.send(204))
      } else {
        response.send(404, {message: "That song could not be deleted, because it does not exist."})
      }
    }).catch(error => response.status(500).send(error));
});

module.exports = router;
