const chai = require('chai');
const chaiHttp = require('chai-http');
const Review = require('../../src/models/review.js');
const app = require('../../src/app.js');
const sinon = require('sinon');
const axios = require('axios');

const { expect } = chai;
chai.use(chaiHttp);

function apiGetMediaData(){
  return {
    data: {
      "Title": "Breaking Bad",
      "Year": "2008-2013",
      "Rated": "TV-MA",
      "Released": "20 Jan 2008",
      "Runtime": "49 min",
      "Genre": "Crime, Drama, Thriller",
      "Director": "N/A",
      "Writer": "Vince Gilligan",
      "Actors": "Bryan Cranston, Aaron Paul, Anna Gunn",
      "Plot": "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
      "Language": "English, Spanish",
      "Country": "United States",
      "Awards": "Won 16 Primetime Emmys. 155 wins & 247 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg",
      "Metascore": "N/A",
      "imdbID": "tt0903747",
      "Type": "series",
      "totalSeasons": "5",
      "Response": "True"
    }
  }
}

function apiGetMedias(){
  return {
    data: {
        "Search": [
            {
                "Title": "Breaking Bad",
                "Year": "2008-2013",
                "imdbID": "tt0903747",
                "Type": "series",
                "Poster": "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg"
            },
            {
                "Title": "El Camino: A Breaking Bad Movie",
                "Year": "2019",
                "imdbID": "tt9243946",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNjk4MzVlM2UtZGM0ZC00M2M1LThkMWEtZjUyN2U2ZTc0NmM5XkEyXkFqcGdeQXVyOTAzMTc2MjA@._V1_SX300.jpg"
            },
            {
                "Title": "The Road to El Camino: Behind the Scenes of El Camino: A Breaking Bad Movie",
                "Year": "2019",
                "imdbID": "tt11151792",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BNDEwNTgyM2MtYzA0ZS00ODU0LWFlMmEtN2NkYzNlNjRhNzJmXkEyXkFqcGdeQXVyMTExNzkxOTY@._V1_SX300.jpg"
            }
        ],
        "totalResults": "3",
        "Response": "True"
    }
  }
}

describe('Reviews API', function () {
  beforeEach(async () => {
    await Review.destroy({ where: {} });
  });

  it('should get all reviews', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
  });

  it('should filter all reviews by title', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews?title=Review 2');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 2');
    expect(res.body[1]).to.have.property('title').deep.equal('Review 2.2');
  });

  it('should filter all reviews by type', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews?type=movie');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(1);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 1');
    expect(res.body[0]).to.have.property('type').deep.equal('movie');
  });

  it('should filter all reviews by rating', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 4, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews?rating=5');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 1');
    expect(res.body[1]).to.have.property('title').deep.equal('Review 2');
  });

  it('should filter all reviews by rating', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 4, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews?rating=5');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 1');
    expect(res.body[1]).to.have.property('title').deep.equal('Review 2');
  });

  it('should filter all reviews by multiple attributes: rating and type', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 4, 'Interesting anime', new Date());

    const res = await chai.request(app).get('/api/reviews?rating=5&type=anime');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(1);
    expect(res.body[0]).to.have.property('title').deep.equal('Review 2');
    expect(res.body[0]).to.have.property('rating').deep.equal(7);
  });

  it('should return a 500 error when filtering', async function () {
    await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());
    await Review.createInstance('Review 2.2', 'anime', 4, 'Interesting anime', new Date());

    const originalFindAll = Review.findAll;
    Review.findAll = function () {
        throw new Error('Error for test');
    }

    const res = await chai.request(app).get('/api/reviews?rating=5');

    expect(res).to.have.status(500);
    expect(res.body).to.deep.equal({ error: 'Internal Server Error' });

    Review.findAll = originalFindAll;
  });


  it('should get one review by its id', async function () {
    const review = await Review.createInstance('Review 1', 'movie', 8, 'Good movie', new Date());
    await Review.createInstance('Review 2', 'anime', 7, 'Interesting anime', new Date());

    const res = await chai.request(app).get(`/api/reviews/${review.id}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title').equal(review.title);
    expect(res.body).to.have.property('type').equal(review.type);
    expect(res.body).to.have.property('rating').equal(review.rating);
    expect(res.body).to.have.property('opinion').equal(review.opinion);
    expect(res.body).to.have.property('id').equal(review.id);
  });

  it('should create a new review', async function () {
    const newReview = {
      title: 'New Review',
      type: 'movie',
      rating: 9,
      opinion: 'Excellent movie',
      watched_at: new Date(),
    };

    const res = await chai.request(app).post('/api/reviews').type('form').send(newReview);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title').equal('New Review');
    expect(res.body).to.have.property('type').equal('movie');
    expect(res.body).to.have.property('rating').equal('9');
    expect(res.body).to.have.property('opinion').equal('Excellent movie');
  });
});

describe('Movies API', function() {
  it('should search movies by its title, returning coincidences', async function() {
    // Make a sinon.stub to axios call
    var stub = sinon.stub(axios, 'get');
    stub.returns(apiGetMedias());

    const res = await chai.request(app).get('/api/media?title=Breaking Bad');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(3);

    stub.restore();
  });

  it('should get movie details by its external id', async function() {
    // Make a sinon.stub to axios call
    var stub = sinon.stub(axios, 'get');
    stub.returns(apiGetMediaData());
    
    const res = await chai.request(app).get('/api/media/tt0903747/');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.a.property('Title').equal('Breaking Bad');

    stub.restore();
  });

});