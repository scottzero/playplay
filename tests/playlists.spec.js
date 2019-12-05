var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var playlists = require('../routes/api/v1/playlists');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const moment = require('moment');


describe('Test POST /api/v1/playlists path', () => {
  it('respond with 201 when created', async () => {
    await database.raw('truncate table playlists cascade');
    const res = await request(app).post("/api/v1/playlists")
      .send({
        "title": "Cleaning House"
      })

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toEqual('A new playlist has been created!');
  });

  it('respond with 400 when title is not given', async () => {
    await database.raw('truncate table playlists cascade');
    const res = await request(app).post("/api/v1/playlists")
      .send({
        "title": null
      })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Please add a title in string format.');
  });

  it('respond with 400 when title is not unique', async () => {
    await database.raw('truncate table playlists cascade');
    let playlist_cleanup = {
      id: 1,
      title: 'Cleaning House'
    };

    await database('playlists').insert(playlist_cleanup, 'id');

    const res = await request(app).post("/api/v1/playlists")
      .send({
        "title": "Cleaning House"
      })

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual('Playlist titles should be unique.');
  });
});

describe('Test GET /api/v1/playlists path', () => {
    it('respond with 200, get an array of playlists...', async () => {
      // database.raw('truncate table playlists cascade');
      //
      // await database('playlists').insert({
      //   id: 5,
      //   'title': 'Cleaning House',
      //   "created_at": moment().toDate(),
      //   "updated_at": moment().toDate()
      // });
      //
      // const res = await request(app).get("/api/v1/playlists");
      //
      // expect(res.statusCode).toBe(200);
      // const expected = [
      //   {
      //     'id': 5,
      //     'title': 'Cleaning House',
      //     "createdAt": "2019-12-05T20:18:31.856Z",
      //     "updatedAt": "2019-12-05T20:18:31.856Z"
      //
      //   }
      // ];
      //
      // expect(res.body).toEqual(expected);
    });
  });
