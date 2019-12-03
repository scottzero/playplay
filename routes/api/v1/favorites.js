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
async function getSong(track, artist){
  const key = await getKey('apikey');
  // try {
    let response = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${track}&q_artist=${artist}&quorum_factor=0.9&apikey=${key}`)
    let song = await response.json();
    let re_artist = await new RegExp(`^${artist}$`)
    // let re_track = await new RegExp(`^${track}$`)
    // let regEx = await /^art$/;
    let data = await song.message.body.track_list.find(obj => ( re_artist.test(obj.track.artist_name) && obj.track.track_name.includes(track)));
    console.log(data);
  // } catch(err){
    // return err;
  // }
}


getSong("Creep", "Radiohead")
