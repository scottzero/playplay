const yaml = require("js-yaml")
const fs = require("fs")
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const router= express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const getKey = (apikey) => {
  return yaml.safeLoad(fs.readFileSync("./config.yml", "utf8"))[apikey];
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
    var useMeData = desiredData(request.body.title, request.body.artistName)
    .then(res =>
      database('favorites').insert({
        title: res.title,
        artistName: res.artistName,
        rating: res.rating,
        genre: res.genre},
        "id")
    ).then(res => response.status(201).send(`${request.body.title} by ${request.body.artistName} has been added to your favorites!`))
    .catch(error => response.status(500).send(error));
});


router.get('/', (request, response)=>{
  database('favorites')
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
  database('favorites').where('id', songId)
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
