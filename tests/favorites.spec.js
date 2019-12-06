var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var favorites = require('../routes/api/v1/favorites');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const songPojo = require('../models/song');


describe('Test GET /api/v1/favorites path', () => {
    it('sad path, havent added any favorites yet...', async () => {
      await database.raw('truncate table favorites cascade');
      const res = await request(app).get("/api/v1/favorites");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('You haven\'t added any favorites yet!');
    });
  });

describe('Test GET /api/v1/favorites path', () => {
  beforeEach(async () => {
       await database.raw('truncate table favorites cascade');
       let song = {
         id: 1,
         title: 'creep',
         artistName: 'radiohead',
         genre: 'alternative',
         rating: 90,
       };
       await database('favorites').insert(song, 'id');
    });

    afterEach(() => {
      database.raw('truncate table favorites cascade');
    });

    it('happy path, get an array of objects...', async () => {
      const res = await request(app).get("/api/v1/favorites");
      expect(res.statusCode).toBe(200);
      const expected = {
        'id': 1,
        'title': 'creep',
        'artistName': 'radiohead',
        'genre': 'alternative',
        'rating': 90
      };
      expect(res.body[0]).toEqual(expected);
    });
  });

  describe('Test GET /api/v1/favorites path', () => {
    beforeEach(async () => {
         await database.raw('truncate table favorites cascade');
         let song = {
           id: 1,
           title: 'creep',
           artistName: 'radiohead',
           genre: 'alternative',
           rating: 90,
         };
         await database('favorites').insert(song, 'id');
      });

      afterEach(() => {
        database.raw('truncate table favorites cascade');
      });

      it('happy path, get a single object...', async () => {
        const res = await request(app).get("/api/v1/favorites/1");
        expect(res.statusCode).toBe(200);
        const expected = {
          'id': 1,
          'title': 'creep',
          'artistName': 'radiohead',
          'genre': 'alternative',
          'rating': 90
        };
        expect(res.body[0]).toEqual(expected);
      });

      it('sad path, cannot find a song with the given ID...', async () => {
        const res = await request(app).get("/api/v1/favorites/3");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toEqual("No favorite song is found with the given id. Please try another ID.");
      });
    });

    describe('Test DELETE /api/v1/favorites/:id path', () => {
        it('sad path, no records in the database...', async () => {
          await database.raw('truncate table favorites cascade');
          const res = await request(app).delete("/api/v1/favorites/1");
          expect(res.statusCode).toBe(404);
          expect(res.body.message).toBe("That song could not be deleted, because it does not exist.");
        });

        it('happy path, delete a single object...', async () => {
          let song = {
            id: 1,
            title: 'creep',
            artistName: 'radiohead',
            genre: 'alternative',
            rating: 90,
          };
          await database('favorites').insert(song, 'id');

          const res = await request(app).delete("/api/v1/favorites/1");
          expect(res.statusCode).toBe(204);
          expect(res.body).toEqual({});
        });
    });

    describe('Test POST /api/v1/favorites path', () => {
      it('respond with 400 not created', async () => {
        await database.raw('truncate table favorites cascade');
        const res = await request(app).post("/api/v1/favorites")
          .send({"artistName": "Test"})

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual('There are some missing attributes in your request parameters.')
      });

      it('respond with 201 when created', async () => {
        await database.raw('truncate table favorites cascade');
        const res = await request(app).post("/api/v1/favorites")
          .send({
            "title": "Creep",
            "artistName": "Radiohead"
          })

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toEqual('Creep by Radiohead has been added to your favorites!');
      });

      it('respond with 400 when given a song that already exists in the db', async () => {
        // await database.raw('truncate table favorites cascade');
        let song = {
          id: 1,
          title: 'creep',
          artistName: 'radiohead',
          genre: 'alternative',
          rating: 90,
        };
        await database('favorites').insert(song, 'id');

        const res = await request(app).post("/api/v1/favorites")
          .send({
            "title": "Creep",
            "artistName": "Radiohead"
          })

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual('This song is already in your favorites list!');
      });
    });
