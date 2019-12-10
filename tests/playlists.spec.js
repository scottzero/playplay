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
      database.raw('truncate table playlists cascade');

      await database('playlists').insert({
        id: 5,
        'title': 'Cleaning House'
        // "created_at": moment().toDate(),
        // "updated_at": moment().toDate()
      });

      const res = await request(app).get("/api/v1/playlists");

      expect(res.statusCode).toBe(200);

      expect(Object.keys(res.body[0])).toContain('id');
      expect(Object.keys(res.body[0])).toContain('title');
      expect(Object.keys(res.body[0])).toContain('createdAt');
      expect(Object.keys(res.body[0])).toContain('updatedAt');
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
      var error = res.error.text.includes("Cannot PUT /api/v1/playlists")
      expect(error).toBe(true);
    });
  });

describe('Test DELETE /api/v1/playlists/:id path', () => {
  it('sad path, no playlists in the database...', async () => {
    await database.raw('truncate table playlists cascade');
    const res = await request(app).delete("/api/v1/playlists/1");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("That playlist could not be deleted, because it does not exist.");
  });

  it('happy path, delete a single playlist object...', async () => {
    let playlist = {
      id: 1,
      title: 'brunch'
    };
    await database('playlists').insert(playlist, 'id');
    const res = await request(app).delete("/api/v1/playlists/1");
    expect(res.statusCode).toBe(204);
    // expect(res.body).toEqual({});
  });
});

describe('Test POST /api/v1/playlists/:id/favorites/:fave_id path', () => {
  it('respond with 201 when created', async () => {
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlists cascade');
    // await database.raw('truncate table favorites_playlists cascade');

    let favorite_song = {
      id: 1,
      title: 'creep',
      artistName: 'radiohead',
      genre: 'Alternative',
      rating: 95
    };
    await database('favorites').insert(favorite_song, 'id');

    let playlist = {
      id: 1,
      title: 'playlist 1'
    };
    await database('playlists').insert(playlist, 'id');

    const res = await request(app).post("/api/v1/playlists/1/favorites/1");
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({Success: 'creep has been added to playlist 1!'});
  });

  it('respond with 400 when favorite song id does not exist', async () => {
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlists cascade');

    let playlist = {
      id: 1,
      title: 'playlist 1'
    };
    await database('playlists').insert(playlist, 'id');

    const res = await request(app).post("/api/v1/playlists/1/favorites/1");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("Either favorite song or playlist does not exist");
  });

  it('respond with 400 when playlist id does not exist', async () => {
    // await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlists cascade');

    let favorite_song = {
      id: 1,
      title: 'creep',
      artistName: 'radiohead',
      genre: 'Alternative',
      rating: 95
    };
    await database('favorites').insert(favorite_song, 'id');

    const res = await request(app).post("/api/v1/playlists/1/favorites/1");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toEqual("Either favorite song or playlist does not exist");
  });
});

describe('Test DELETE /api/v1/playlists/:id/favorites/:fave_id path', () => {
  it('respond with 204 when deleted', async () => {
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlists cascade');

    let favorite_song = {
      id: 1,
      title: 'creep',
      artistName: 'radiohead',
      genre: 'Alternative',
      rating: 95
    };
    await database('favorites').insert(favorite_song, 'id');

    let playlist = {
      id: 1,
      title: 'playlist 1'
    };
    await database('playlists').insert(playlist, 'id');
    await database('favorites_playlists').insert({favorite_id: favorite_song.id, playlist_id: playlist.id}, "id");

    const res = await request(app).delete("/api/v1/playlists/1/favorites/1");
    expect(res.statusCode).toBe(204);

    const playlist_remains = await database('playlists').where("id", 1).select('title')
    expect(playlist_remains[0].title).toEqual('playlist 1');

    const favorite_remains = await database('favorites').where("id", 1).select('title')
    expect(favorite_remains[0].title).toEqual('creep');
  });

  it('sad path, either favorite or playlist does not exist in the database...', async () => {
    await database.raw('truncate table favorites cascade');
    await database.raw('truncate table playlists cascade');

    const res = await request(app).delete("/api/v1/playlists/1/favorites/1");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("That song could not be deleted, because it does not exist.");
  });
});
