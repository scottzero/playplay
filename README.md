# Node Express Favorite Music API project
<!-- Brief explanation -->
In this paired project, we build a JSON API that exposes four endpoints (as shown below). We consumed [Musixmatch API](https://developer.musixmatch.com/) to fetch raw data ...


### Schema Design
![favorites-table](https://user-images.githubusercontent.com/24424825/70000810-eeeb0700-1518-11ea-9ed6-2acf5369865a.png)
- As shown above, there is a Favorite table that has four attributes (i.e., title, artist name, genre, and rating).


## Getting started
- Demo: [Sweater-Weather API](https://playoplay.herokuapp.com/)
- Alternatively, [Postman](https://www.getpostman.com/downloads/) can be used to make HTTP requests.

#### 1. Adding a favorite song
- On Postman, specify the following request type `POST`, and add the following url to the address bar `https://playoplay.herokuapp.com/api/v1/favorites`. Then, click `Send`. It should look like this:
![postman](https://user-images.githubusercontent.com/24424825/70001084-a718af80-1519-11ea-9cf2-32784eb5356f.png)

- A successful request would generate a response that looks something like this:

  ```
  status: 201
  ```

- If there is a missing attribute in your request, then a 400 status code will be returned.


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


#### 4. Deleting one of your favorites
- To delete a specific song, select `DELETE` from the dropdown and append an id to the following endpoint: `https://playoplay.herokuapp.com/api/v1/favorites/:id`.

- A successful request would return an array containing an object as follows:

  ```
  status: 204
  ```

- If the record with a given ID isn't found, a 404 status code (Not Found) will be returned.


### For Developers: How to Run Tests
- In your terminal, clone down this repository and run the following commands:

```
$ npm install
$ knex migrate:latest
$ npm test
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
