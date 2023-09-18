var assert = require('assert');
const sequelize = require('../../src/config/database.js');
const { Op } = require("sequelize");
const Review = require('../../src/models/review.js');
const { apiCreateReview, apiGetAllReviews, apiGetReview } = require('../../src/controllers/review.js');
const { searchMedia, getMedia } = require('../../src/controllers/media.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
const axios = require('axios');

chai.use(chaiHttp);

function getMediaData(){
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

function getMedias(){
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

describe('Review model', function (){
  
  before(async function() {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
    } catch (err) {
      console.error('Database error:', err);
    }
  });

  afterEach(async function() {
    // Delete all Review instances after each test.
    await Review.destroy({ where: {}});
  });

  it('creation method should return an instance', async function (){
    const watched_at = new Date('2023-09-17').setHours(0, 0, 0, 0);
    const barbieReview = await Review.createInstance('Barbie', 'movie', 8, 'An interesting movie', watched_at, 'a1b2ced4', 'http://image.url');

    assert.strictEqual(barbieReview.title, 'Barbie');
    assert.strictEqual(barbieReview.type, 'movie');
    assert.strictEqual(barbieReview.rating, 8);
    assert.strictEqual(barbieReview.opinion, 'An interesting movie');
    assert.strictEqual(new Date(barbieReview.watched_at).setHours(0, 0, 0, 0), watched_at);
    assert.strictEqual(barbieReview.external_id, 'a1b2ced4');
    assert.strictEqual(barbieReview.image, 'http://image.url');
  });

  it('creation method should create an instance in the database', async function (){
    // There are 0 instances of Reviews
    assert.equal(await Review.count(), 0);
    
    const watched_at = new Date('2023-09-17').setHours(0, 0, 0, 0);
    await Review.createInstance('Barbie', 'movie', 8, 'An interesting movie', watched_at);
  
    // A new review instance has been created
    assert.equal(await Review.count(), 1);
  });

  it('creation method should fail if data has not the correct type', async function () {
    try {
      await Review.createInstance('Invalid', 'invalid', 5, 'An invalid review', new Date());
      assert.fail('Expected an error for invalid type, but no error was thrown');
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
      assert.strictEqual(error.errors[0].message, 'Value should be movie, anime or series');
    }
  });

  it('creation method should fail if rating is not in range', async function () {
    try {
      await Review.createInstance('Invalid', 'movie', 15, 'An invalid review', new Date());
      assert.fail('Expected an error for invalid type, but no error was thrown');
    } catch (error) {
      assert.strictEqual(error.name, 'SequelizeValidationError');
    }
  });

});

describe('Review controllers', function () {
  describe('apiCreateReview', function () {
    it('should create a new review', async function () {
      // Create a fake request and a fake response
      const req = {
        body: {
          title: 'A test movie',
          type: 'movie',
          ranking: 8,
          opinion: 'A test opinion',
          watched_at: '2019-5-23'
        }
      }
      const res = {
        json: sinon.spy()
      }

      await apiCreateReview(req, res);

      // Check response review properties
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.be.an('object');
      expect(res.json.firstCall.args[0]).to.have.a.property('title').equal('A test movie');
    });
  });

  describe('apiGetAllReviews', function () {
    it('should get all reviews', async function () {
      // Create a fake request and a fake response
      const req = {}
      const res = {
        json: sinon.spy()
      }

      // Mock Review.findAll() method
      var stub = sinon.stub(Review, 'findAll');
      stub.returns(['Review 1', 'Review 2']);

      await apiGetAllReviews(req, res);

      // Check response array properties
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.be.an('array');
      expect(res.json.firstCall.args[0]).to.have.lengthOf(2);

      stub.restore();
    });

    it('should search for records by title', async function () {
      const req = {
          query: {
              title: 'ExampleName'
          },
      };
      const res = {
          json: sinon.spy()
      };

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'ExampleName' }]);

      await apiGetAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.title[Op.substring]).to.equal('ExampleName');

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([{ id: 1, title: 'ExampleName' }]);

      findAllStub.restore();
    });

    it('should search for records by title', async function () {
      const req = {
          query: {
              title: 'ExampleName'
          },
      };
      const res = {
          json: sinon.spy()
      };

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'ExampleName' }]);

      await apiGetAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.title[Op.substring]).to.equal('ExampleName');

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([{ id: 1, title: 'ExampleName' }]);

      findAllStub.restore();
    });

    it('should search for records by type', async function () {
      const req = {
          query: {
              type: 'movie'
          },
      };
      const res = {
          json: sinon.spy()
      };

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);

      await apiGetAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.type).to.equal('movie');

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);

      findAllStub.restore();
    });

    it('should search for records by rating', async function () {
      const req = {
          query: {
              rating: 5
          },
      };
      const res = {
          json: sinon.spy()
      };

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);

      await apiGetAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.rating[Op.gte]).to.equal(5);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.deep.equal([{ id: 1, title: 'Movie 1' }, { id: 2, title: 'Movie 2' }]);

      findAllStub.restore();
    });

    it('should filter by type and rating', async function() {
      const req = {
        query: {
          rating: 5,
          type: 'anime'
        }
      }
      const res = {
        json: sinon.spy()
      }

      const findAllStub = sinon.stub(Review, 'findAll');
      findAllStub.returns([{ id: 1, title: 'Anime 1' }, { id: 2, title: 'Anime 2' }]);

      await apiGetAllReviews(req, res);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0].where.rating[Op.gte]).to.equal(5);
      expect(findAllStub.firstCall.args[0].where.type).to.equal('anime');
    })
  });

  describe('apiGetReview', function () {
    it('should get a review by its id', async function () {
      // Create a fake request and a fake response
      const req = {
        params: {
          id: 3
        }
      }
      const res = {
        json: sinon.spy()
      }

      // Mock Review.findByPk() method
      var stub = sinon.stub(Review, 'findByPk')
      stub.returns('Review_3');

      await apiGetReview(req, res);

      // Check response
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall).to.be.an('object');
      expect(res.json.firstCall.args[0]).to.deep.equal('Review_3');

      // Check if stub has been called with correct arguments
      expect(stub.calledOnce).to.be.true;
      expect(stub.calledWith(3)).to.be.true;

      stub.restore();
    });
  });
});

describe('Media controller', function() {
  describe('searchMedia', function() {
    it('should search media by its title, returning coincidences', async function() {
      const req = {
        query: {
          title: 'Breaking Bad'
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call
      var stub = sinon.stub(axios, 'get');
      stub.returns(getMedias());

      await searchMedia(req, res);

      expect(res.json.calledOnce).to.be.true;
      // Check that API data has been transformed correctly
      expect(JSON.stringify(res.json.firstCall.args[0])).to.equal(JSON.stringify([
        {
            "Title": "Breaking Bad",
            "Year": "2008-2013",
            "ExternalID": "tt0903747",
            "Type": "series",
            "Image": "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg"
        },
        {
            "Title": "El Camino: A Breaking Bad Movie",
            "Year": "2019",
            "ExternalID": "tt9243946",
            "Type": "movie",
            "Image": "https://m.media-amazon.com/images/M/MV5BNjk4MzVlM2UtZGM0ZC00M2M1LThkMWEtZjUyN2U2ZTc0NmM5XkEyXkFqcGdeQXVyOTAzMTc2MjA@._V1_SX300.jpg"
        },
        {
            "Title": "The Road to El Camino: Behind the Scenes of El Camino: A Breaking Bad Movie",
            "Year": "2019",
            "ExternalID": "tt11151792",
            "Type": "movie",
            "Image": "https://m.media-amazon.com/images/M/MV5BNDEwNTgyM2MtYzA0ZS00ODU0LWFlMmEtN2NkYzNlNjRhNzJmXkEyXkFqcGdeQXVyMTExNzkxOTY@._V1_SX300.jpg"
        }
      ]));
      expect(stub.calledOnce).to.be.true;
      // Check that url used contains: http://www.omdbapi.com/?s=Breaking Bad
      expect(stub.calledWithMatch('http://www.omdbapi.com/?s=Breaking Bad')).to.be.true;

      stub.restore();
    });

    it('should return an empty array if an error occurs', async function() {
      const req = {
        query: {
          title: 'Breaking Bad'
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call to throw an error
      var stub = sinon.stub(axios, 'get');
      stub.throws()

      await searchMedia(req, res);

      expect(res.json.firstCall.args[0]).to.eql([]);
      expect(stub.calledOnce).to.be.true;

      stub.restore();
    });

    it('should return an empty array if no title passed', async function() {
      const req = {
      }

      const res = {
        json: sinon.spy()
      }

      await searchMedia(req, res);

      expect(res.json.firstCall.args[0]).to.eql([]);

    });

    it('should filter media by not including other types than movie or series', async function() {
      const req = {
        query: {
          title: 'Breaking Bad'
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call
      var stub = sinon.stub(axios, 'get');
      stub.returns({
        data: {
            "Search": [
                {
                    "Title": "Breaking Bad",
                    "Type": "series",
                },
                {
                  "Title": "Breaking Bad: The game",
                  "Type": "game",
                },
                {
                    "Title": "El Camino: A Breaking Bad Movie",
                    "Type": "movie",
                },
                {
                    "Title": "The Road to El Camino: Behind the Scenes of El Camino: A Breaking Bad Movie",
                    "Type": "movie",
                }
            ],
            "totalResults": "4",
            "Response": "True"
        }
      });

      await searchMedia(req, res);

      expect(res.json.calledOnce).to.be.true;
      // Check that API data has been transformed correctly
      expect(JSON.stringify(res.json.firstCall.args[0])).to.equal(JSON.stringify([
        {
          "Title": "Breaking Bad",
          "Type": "series",
        },
        {
            "Title": "El Camino: A Breaking Bad Movie",
            "Type": "movie",
        },
        {
            "Title": "The Road to El Camino: Behind the Scenes of El Camino: A Breaking Bad Movie",
            "Type": "movie",
        }
      ]));
      expect(stub.calledOnce).to.be.true;
      // Check that url used contains: http://www.omdbapi.com/?s=Breaking Bad
      expect(stub.calledWithMatch('http://www.omdbapi.com/?s=Breaking Bad')).to.be.true;

      stub.restore();
    });
  });

  describe('getMedia', function() {
    it('should get movie details', async function() {
      const req = {
        params: {
          id: 3
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call
      var stub = sinon.stub(axios, 'get');
      stub.returns(getMediaData());
      
      await getMedia(req, res);

      expect(res.json.calledOnce).to.be.true;
      // Check that API data has been transformed correctly
      expect(JSON.stringify(res.json.firstCall.args[0])).to.equal(JSON.stringify(
        {
          "Title": "Breaking Bad",
          "Year": "2008-2013",
          "Genre": "Crime, Drama, Thriller",
          "Director": "N/A",
          "Writer": "Vince Gilligan",
          "Actors": "Bryan Cranston, Aaron Paul, Anna Gunn",
          "Description": "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
          "Image": "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg",
          "ExternalID": "tt0903747",
          "Type": "series",
          "Seasons": "5",
        }
      ));

      expect(stub.calledOnce).to.be.true;
      // Check that url used contains: http://www.omdbapi.com/?i=3
      expect(stub.calledWithMatch('http://www.omdbapi.com/?i=3')).to.be.true;

      stub.restore();
    });

    it('should return an empty object if media type is not movie or series', async function() {
      const req = {
        params: {
          id: 3
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call
      var stub = sinon.stub(axios, 'get');
      stub.returns({
        data: {
          "Title": "League of Legends",
          "Type": "game",
          "Response": "True"
        }
      });
      
      await getMedia(req, res);

      expect(res.json.calledOnce).to.be.true;
      // Check that API data has been transformed correctly
      expect(res.json.firstCall.args[0]).to.eql({});

      expect(stub.calledOnce).to.be.true;
      // Check that url used contains: http://www.omdbapi.com/?i=3
      expect(stub.calledWithMatch('http://www.omdbapi.com/?i=3')).to.be.true;

      stub.restore();
    });

    it('should return an empty object if an error occurs', async function() {
      const req = {
        params: {
          id: 3
        }
      }

      const res = {
        json: sinon.spy()
      }

      // Make a sinon.stub to axios call
      var stub = sinon.stub(axios, 'get');
      stub.throws();
      
      await getMedia(req, res);

      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.eql({});
      expect(stub.calledOnce).to.be.true;

      stub.restore();
    });
  });
});

