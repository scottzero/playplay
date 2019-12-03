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
const songPojo = require('../../../models/song')
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
  return filteredSongData // returns Song {
                                      // title: 'Creep - String Quartet Tribute to Radiohead',
                                      // artistName: 'Vitamin String Quartet',
                                      // rating: 28 }
}

desiredData("Creep", "Radiohead")

router.post('/', (request, response)=>{
  async function banana(request, response){
  database('favorites').then(faves => {
    console.log(request.body)
    var useMeData = await desiredData(request.title, request.artistName);
    var id = request.id;
    var title = useMeData.title;
    var artistName = useMeData.artistName;
    var rating = useMeData.rating;
    database('favorites').insert({title: title, artistName: artistName, rating: rating}, "id")
    .then(res => response.status(201).send('song has been added to your favorites'))
    .catch(error => response.status(500).send(error));
    };
    banana(request,response);
  });
});



module.exports = router;
// desiredData("Creep", "Radiohead")
