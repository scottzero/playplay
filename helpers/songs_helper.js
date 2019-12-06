const fetch = require('node-fetch');
const env = require('dotenv').config();

const songPojo = require('../models/song');

const getSong = async function (track, artist) {
  let response = await fetch(`https://api.musixmatch.com/ws/1.1/matcher.track.get?q_track=${track}&q_artist=${artist}&apikey=${process.env.apikey}`)
  let song = await response.json();
  let data = await song.message.body
  return data;
}

const desiredData = async function (track, artist) {
  var songData = await getSong(track, artist);
  var filteredSongData = await new songPojo(songData);
  return filteredSongData
}

module.exports = desiredData;
