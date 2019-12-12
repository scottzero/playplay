# Node Express Favorite Music API project
<!-- Brief explanation -->
In this paired project, we build a JSON RESTful API that exposes 11 endpoints for Favorite and Playlist models. Users can perform CRUD operations (i.e., creating a new record, getting all or one specific record, updating an existing record, and deleting an existing record) from these endpoints. Raw data for a given song were collected from [Musixmatch API](https://developer.musixmatch.com/), which were then formatted to match the specifications shown [here](https://backend.turing.io/module4/projects/play/play).


### Schema Design
![dbschema](https://user-images.githubusercontent.com/24424825/70681645-4562ee80-1c59-11ea-8c39-ad7dd1c5922b.png)


## Getting started
- Demo: [Play-O-Play](https://playoplay.herokuapp.com/)
- Alternatively, [Postman](https://www.getpostman.com/downloads/) can be used to make HTTP requests.

### Favorite Songs
#### 1. Adding a favorite song
- On Postman, specify the following request type `POST`, and add the following url to the address bar `https://playoplay.herokuapp.com/api/v1/favorites`. Then, click `Send`. It should look like this:
![postman](https://user-images.githubusercontent.com/24424825/70001084-a718af80-1519-11ea-9cf2-32784eb5356f.png)

- A successful request would generate a response that looks something like this:

  ```
  status: 201
  ```

- If there is a missing attribute in your request, then a 400 status code will be returned.
  ```
  {
    "message": "There are some missing attributes in your request parameters."
  }
  ```


#### 2. Getting a list of all your favorites
- Specify the request type as `GET` and add the following endpoint to the address bar: `https://playoplay.herokuapp.com/api/v1/favorites`.

- A successful request would generate a response that looks something like this:

  ```
  status: 200
  body:
  [
    {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    },
    {
      "id": 2,
      "title": "Careless Whisper",
      "artistName": "George Michael",
      "genre": "Pop",
      "rating": 93
    },
  ]
  ```

- For a bad request, a 404 status code (Not Found) will be returned.
  ```
  {
    "message": "You haven't added any favorites yet!"
  }
  ```

#### 3. Getting a single favorite song
- To get one of your favorites, select `GET` from the dropdown and append an id to the following endpoint: `https://playoplay.herokuapp.com/api/v1/favorites/:id`.

- A successful request would return an array containing an object as follows:

  ```
  status: 200
  body:
  [
    {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
  ]
  ```

- If the record with a given ID isn't found, a 404 status code (Not Found) will be returned.
  ```
  {
    "message": "No favorite song is found with the given id. Please try another ID."
  }
  ```


#### 4. Deleting one of your favorites
- To delete a specific song, select `DELETE` from the dropdown and append an id to the following endpoint: `https://playoplay.herokuapp.com/api/v1/favorites/:id`.

- A successful request would return an array containing an object as follows:

  ```
  status: 204
  ```

- If the record with a given ID isn't found, a 404 status code (Not Found) will be returned.
  ```
  {
    "message": "That song could not be deleted, because it does not exist."
  }
  ```

---
### Playlists
#### 5. Adding a new playlist
- On Postman, specify the following request type `POST`, and add the following url to the address bar `https://playoplay.herokuapp.com/api/v1/playlists` along with a unique title for the playlist as shown below. Then, click `Send`.
  ```
  Body: (as json)
  {
  	"title": "Christmas"
  }
  ```
- A successful request would generate a response that looks something like this:

  ```
  {
    "message": "A new playlist has been created!"
  }
  ```

- If there is a missing attribute in your request, then a 400 status code will be returned.
  ```
  // When required params are missing
  {
    "message": "Please add a title in string format."
  }

  // When the given title is not unique
  {
    "message": "Playlist titles should be unique."
  }
  ```

#### 6. Getting a list of all your playlists
- Specify the request type as `GET` and add the following endpoint to the address bar: `https://playoplay.herokuapp.com/api/v1/playlists`.

- A successful request would generate a response that looks something like this:

  ```
  status: 200
  body:
  [
    {
      "id": 1,
      "title": "Cleaning House",
      "songCount": 2,
      "songAvgRating": 27.5,
      "favorites": [
                      {
                        "id": 1,
                        "title": "We Will Rock You",
                        "artistName": "Queen"
                        "genre": "Rock",
                        "rating": 25
                      },
                      {
                        "id": 4,
                        "title": "Back In Black",
                        "artistName": "AC/DC"
                        "genre": "Rock",
                        "rating": 30
                      }
                    ],
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
    },
    {
      "id": 2,
      "title": "Running Mix",
      "songCount": 0,
      "songAvgRating": 0,
      "favorites": []
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
    }
  ]
  ```

- For a bad request, or when the playlist table has no records yet, a 404 status code (Not Found) will be returned.
 ```
 {
    "message": "No playlist found"
  }
 ```

#### 7. Getting a single favorite playlist
- To get one of your playlists, select `GET` from the dropdown and append an id to the following endpoint: `https://playoplay.herokuapp.com/api/v1/playlists/:id`.

- A successful request would return an array containing an object as follows:

  ```
  status: 200
  body:
  [
    {
        "id": 2,
        "title": "Summer road trip",
        "createdAt": "2019-12-06T18:03:32.104Z",
        "updatedAt": "2019-12-06T18:03:32.104Z"
    }
  ]
  ```

- If the record with a given ID isn't found, a 404 status code (Not Found) will be returned.
  ```
  {
    "message": "No playlist found"
  }
  ```


#### 8. Deleting one of your playlists
- To delete a specific song, select `DELETE` from the dropdown and append an id to the following endpoint: `https://playoplay.herokuapp.com/api/v1/playlists/:id`.

- A successful request would return a 204 status code:

  ```
  status: 204
  ```

- If the record with a given ID isn't found, a 404 status code (Not Found) will be returned.
  ```
  {
    "message": "That playlist could not be deleted, because it does not exist."
  }
  ```

#### 9. Adding a favorite song to a playlist
- To add a specific song to an existing playlist, select 'POST' from the dropdown and provide a playlist id and a favorite id: `https://playoplay.herokuapp.com/api/v1/playlists/:id/favorites/:id`.

- A successful request would return a success message with a status code of 201:

  ```
  {
    "Success": "{Song Title} has been added to {Playlist Title}!"
  }
  ```

- If the favorite is not successfully added to the playlist it returns a 400 with the following message in the body.

  ```
  // When the song already exists in the playlist
  { message: "You've already added this song to this playlist!" }

  // When either playlist or favorite id is not found
  { message: "Either favorite song or playlist does not exist" }
  ```


#### 10. Getting a playlist with the list of favorites
- To return all favorites within a given playlist, select 'GET' from the dropdown and provide a playlist id: `https://playoplay.herokuapp.com/api/v1/playlists/:id/favorites`.

- A successful request would return a playlist object with detailed information about the songs, including the number of songs and the average rating of all songs within the playlist.

  ```
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites" : [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                 ],
      "createdAt": 2019-11-26T16:03:43+00:00,
      "updatedAt": 2019-11-26T16:03:43+00:00
  }
  ```

- If a playlist with the given ID isn't found, a 404 status code (Not Found) will be returned.

  ```
  {
    "message": "No playlist found"
  }
  ```

#### 11. Deleting a favorite from a specific playlist
- To delete a favorite song from a given playlist (only removing the relation, not the actual records from the database), select 'DELETE' from the dropdown and provide a playlist id and a favorite id: `https://playoplay.herokuapp.com/api/v1/playlists/:id/favorites/:id`.

- A successful request would return a 204 status code:

  ```
  status: 204
  ```

- If the favorite can't be found, a 404 status code (Not Found) will be returned.

  ```
  { message: "That song could not be deleted, because it does not exist." }
  ```

---
### For Developers: How to Run Tests
- For testing, we used Jest with the following dependencies:
  ```
  "babel-jest": "^24.9.0",
  "jest": "^24.9.0",
  "shelljs": "^0.8.3",
  "supertest": "^4.0.2"
  ```
- In your terminal, clone down this repository and run the following commands:

  ```
  $ npm install
  $ knex migrate:latest
  $ knex migrate:latest --env test
  $ npm test
  ```

- To access test coverage report:

  ```
  $ open coverage/lcov-report/index.html
  ```

### Product Management
- Project Board: https://github.com/scottzero/playplay/projects/1
- DTR: https://gist.github.com/nancylee713/63f05f133cfc46a547a9b42a015ce69e

### Versions
```
node 10.16.3
```

### Core Contributors
- Scott Payton & Nancy Lee
- Project oversight: Turing instructors
