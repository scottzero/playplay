const express = require('express');
const app = express();
const router= express.Router();
const database = require('../../../config')
const desiredData = require('../../../helpers/songs_helper')

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
  database('favorites').columns(['id', 'title', 'artistName', 'genre', 'rating'])
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
  database('favorites').where('id', songId).columns(['id', 'title', 'artistName', 'genre', 'rating'])
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
