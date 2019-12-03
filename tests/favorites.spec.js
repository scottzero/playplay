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
        title: 'creep',
        artistName: 'radiohead',
        genre: 'alternative',
        rating: 90
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
          console.log(res.body)
          expect(res.statusCode).toBe(200);
          const expected = {
            title: 'creep',
            artistName: 'radiohead',
            genre: 'alternative',
            rating: 90
          };
          expect(res.body[0]).toEqual(expected);
        });
      });
  //   it('happy path, get a single object...', async () => {
  //     const res = await request(app).get("/api/v1/favorites/1");
  //     expect(res.statusCode).toBe(200);
  //     const expected = {
  //       title: 'creep',
  //       artistName: 'radiohead',
  //       genre: 'alternative',
  //       rating: 90
  //     };
  //     expect(res.body[0]).toEqual(expected);
  //   });
  // });
