# Review App

## Objective
An app for creating reviews of films and series, while practicing Node.js, Express, Sequelize and Sqlite3 as database.

## Instalation
```
npm install
npm start
```


## Testing


Run all unit and integration tests using Mocha, Chai and Sinon packages.
```
npm test
```

## Endpoints
- GET `/reviews`: Retrieve all created reviews. You can filter using query parameters: `title, type, rating`.
    
- POST `/reviews`: Create a new review. Required fields: `title, type, rating, opinion, watched_at`.

- GET `/reviews/id`: Get a review data by using its id.

- GET `/media`: Search media content (series, movies) by their titles (as query parameter).

- GET `/media/id`: Get media content (series, movies) by using their ids (obtained from the previous endpoint).

## Models
This app defines the following models:

### Review
Describes an user's evaluation of a media content. Model fields:
- `title`: String.
- `type`: String. Values: `anime, series, movie`.
- `rating`: Integer range from 0 to 10.
- `opinion`: String.
- `watched_at`: Datetime.


## Improvement
- Set a relationship between API media and reviews, by using a new field `externalID`.
- Allow reviews edition and deletion.
- Add users.