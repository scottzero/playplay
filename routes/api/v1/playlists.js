const env = require('dotenv').config();
const express = require('express');
const app = express();
const router= express.Router();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

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

module.exports = router;
