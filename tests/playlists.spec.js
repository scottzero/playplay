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
  it('respond with 201, when updated...', async () => {
    await database.raw('truncate table playlists cascade');

    let playlist_cleanup = {
      id: 2,
      title: 'Running Mix'
    };

    await database('playlists').insert(playlist_cleanup, 'id');

    const res = await request(app).put("/api/v1/playlists/2")
      .send({
        id: 2,
        "title": "Marathon Running Mix"
      })

    expect(res.statusCode).toBe(201);

    var expected = {
                      "id": 2,
                      "title": "Marathon Running Mix",
                      "createdAt": `2019-11-26T16:03:43+00:00`,
                      "updatedAt": `2019-11-26T16:03:43+00:00`
                  }

    expect(res.body).toEqual(expected);
  })

})


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

  describe('Test PUT /api/v1/playlists/:id path', () => {
    it('respond with 201 when updated', async () => {
      await database.raw('truncate table playlists cascade');
      await database('playlists').insert({
        id: 3,
        'title': 'Cleaning House',
        "created_at": "2019-12-05T20:35:01.986Z",
        "updated_at": "2019-12-05T20:35:01.986Z"
      });

      const res = await request(app).put("/api/v1/playlists/3")
        .send({
          "title": "Cleaning Room"
        })

      expect(res.statusCode).toBe(200);

      var expected = {
          "id": 3,
          "title": "Cleaning Room",
          "createdAt": "2019-12-05T20:35:01.986Z",
          "updatedAt": "2019-12-05T20:35:01.986Z"
        }

      expect(res.body).toEqual(expected);
    });

    it('respond with 400 when title is already used', async () => {
      await database.raw('truncate table playlists cascade');
      await database('playlists').insert({
        id: 1,
        'title': 'Cleaning House',
        "created_at": "2019-12-05T20:35:01.986Z",
        "updated_at": "2019-12-05T20:35:01.986Z"
      });

      await database('playlists').insert({
        id: 2,
        'title': 'Cleaning Room',
        "created_at": "2019-12-05T20:35:01.986Z",
        "updated_at": "2019-12-05T20:35:01.986Z"
      });

      const res = await request(app).put("/api/v1/playlists/2")
        .send({
          "title": "Cleaning House"
        })

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Playlist titles should be unique.');
    });

    it('respond with 404 when a given ID is not found', async () => {
      await database.raw('truncate table playlists cascade');

      const res = await request(app).put("/api/v1/playlists/1")
        .send({
          "title": "Cleaning House"
        })

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Playlist with the given id is not found.");
    });

    it('respond with 404 when ID is missing in the url', async () => {
      await database.raw('truncate table playlists cascade');

      const res = await request(app).put("/api/v1/playlists")
        .send({
          "title": "Cleaning House"
        })

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Cannot PUT /api/v1/playlists");
    });
  });
